const { parentPort, workerData } = require('worker_threads');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');
const sharp = require('sharp');

(async () => {
  const { file, outDir } = workerData;
  const base = path.parse(file.name).name;
  const inputPath = path.join(outDir, `${base}_input.png`);
  const outputPath = path.join(outDir, `${base}_nobg.png`);

  try {
    // Сохраняем входной файл во временную папку (всегда как PNG)
    await sharp(Buffer.from(file.buffer)).png().toFile(inputPath);

    // Запускаем rembg через child_process
    await new Promise((resolve, reject) => {
      execFile('rembg', ['i', inputPath, outputPath], (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve();
        }
      });
    });

    // Проверяем, что файл создан
    if (!fs.existsSync(outputPath)) {
      throw new Error('rembg не создал выходной файл');
    }

    // Генерируем превью (миниатюру) для результата
    let thumbnailDataUrl = null;
    try {
      const thumbnailBuffer = await sharp(outputPath).resize(48, 48).png().toBuffer();
      thumbnailDataUrl = `data:image/png;base64,${thumbnailBuffer.toString('base64')}`;
    } catch (e) {
      // Если не удалось создать превью, оставляем null
    }

    parentPort.postMessage({
      name: `${base}_nobg.png`,
      path: outputPath,
      thumbnail: thumbnailDataUrl
    });
  } catch (error) {
    parentPort.postMessage({ name: file.name, error: error.message });
  } finally {
    // Можно удалить временный input-файл
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
  }
})(); 