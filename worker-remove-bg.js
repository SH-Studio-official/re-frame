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
    console.log('[worker-remove-bg] Старт обработки:', file.name);
    // Сохраняем входной файл во временную папку (всегда как PNG)
    await sharp(Buffer.from(file.buffer)).png().toFile(inputPath);
    console.log('[worker-remove-bg] Входной файл сохранён:', inputPath);

    // Запускаем rembg через child_process
    await new Promise((resolve, reject) => {
      console.log('[worker-remove-bg] Запуск rembg:', inputPath, '->', outputPath);
      execFile('rembg', ['i', inputPath, outputPath], (error, stdout, stderr) => {
        if (error) {
          console.error('[worker-remove-bg] rembg error:', stderr || error.message);
          reject(stderr || error.message);
        } else {
          console.log('[worker-remove-bg] rembg завершён успешно');
          resolve();
        }
      });
    });

    // Проверяем, что файл создан
    if (!fs.existsSync(outputPath)) {
      console.error('[worker-remove-bg] Файл результата не найден:', outputPath);
      throw new Error('rembg не создал выходной файл');
    }
    console.log('[worker-remove-bg] Файл результата создан:', outputPath);

    // Генерируем превью (миниатюру) для результата
    let thumbnailDataUrl = null;
    try {
      const thumbnailBuffer = await sharp(outputPath).resize(48, 48).png().toBuffer();
      thumbnailDataUrl = `data:image/png;base64,${thumbnailBuffer.toString('base64')}`;
      console.log('[worker-remove-bg] Превью создано');
    } catch (e) {
      console.error('[worker-remove-bg] Ошибка создания превью:', e.message);
    }

    parentPort.postMessage({
      name: `${base}_nobg.png`,
      path: outputPath,
      thumbnail: thumbnailDataUrl
    });
    console.log('[worker-remove-bg] Результат отправлен в main.js');
  } catch (error) {
    console.error('[worker-remove-bg] Ошибка:', error.message);
    parentPort.postMessage({ name: file.name, error: error.message });
  } finally {
    // Можно удалить временный input-файл
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
      console.log('[worker-remove-bg] Временный входной файл удалён:', inputPath);
    }
  }
})(); 