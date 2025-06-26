const { parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

(async () => {
  const { file, format, outDir, resize } = workerData;
  const ext = format.toLowerCase();
  const base = path.parse(file.name).name;
  const sourceExt = path.parse(file.name).ext.toLowerCase();

  try {
    let sharpInst = null;
    let outPath;
    let resultData = null;

    // Проверяем исходный формат файла
    if (sourceExt === '.ico') {
      // Если исходный файл ICO
      if (ext === 'ico') {
        // Если целевой формат тоже ICO, просто копируем файл
        outPath = path.join(outDir, `${base}.ico`);
        fs.copyFileSync(file.path, outPath);
        resultData = { name: `${base}.ico`, path: outPath };
      } else {
        // Если целевой формат не ICO, нужна библиотека для чтения ICO или другая логика конвертации
        // Пока что просто сообщим об ошибке, так как у нас нет такой возможности
        throw new Error(`Conversion from ICO to ${ext} is not yet supported.`);
      }
    } else {
      // Если исходный файл не ICO, используем sharp как раньше
      sharpInst = sharp(Buffer.from(file.buffer));

      // --- Применяем resize, если задан ---
      if (resize && (resize.width || resize.height)) {
        sharpInst = sharpInst.resize(resize.width || null, resize.height || null, { fit: 'inside' });
      }

      switch (ext) {
        case 'png':
          outPath = path.join(outDir, `${base}.png`);
          await sharpInst.png().toFile(outPath);
          resultData = { name: `${base}.png`, path: outPath };
          break;
        case 'jpg':
        case 'jpeg':
          outPath = path.join(outDir, `${base}.jpg`);
          await sharpInst.jpeg().toFile(outPath);
          resultData = { name: `${base}.jpg`, path: outPath };
          break;
        case 'webp':
          outPath = path.join(outDir, `${base}.webp`);
          await sharpInst.webp().toFile(outPath);
          resultData = { name: `${base}.webp`, path: outPath };
          break;
        case 'gif':
          outPath = path.join(outDir, `${base}.gif`);
          await sharpInst.gif().toFile(outPath);
          resultData = { name: `${base}.gif`, path: outPath };
          break;
        case 'tiff':
          outPath = path.join(outDir, `${base}.tiff`);
          await sharpInst.tiff().toFile(outPath);
          resultData = { name: `${base}.tiff`, path: outPath };
          break;
        case 'heic':
          outPath = path.join(outDir, `${base}.heic`);
          await sharpInst.heif().toFile(outPath);
          resultData = { name: `${base}.heic`, path: outPath };
          break;
        case 'jp2':
          outPath = path.join(outDir, `${base}.jp2`);
          await sharpInst.jp2().toFile(outPath);
          resultData = { name: `${base}.jp2`, path: outPath };
          break;
        case 'ico':
          // Конвертация в ICO из других форматов
          outPath = path.join(outDir, `${base}.ico`);
          const pngBuffer = await sharpInst.png().toBuffer();
          const icoBuffer = await pngToIco([pngBuffer]);
          fs.writeFileSync(outPath, icoBuffer);

          // --- Generate PNG thumbnail for preview ---
          const thumbnailBuffer = await sharpInst.resize(48, 48).png().toBuffer(); // Размер миниатюры 48x48
          const thumbnailDataUrl = `data:image/png;base64,${thumbnailBuffer.toString('base64')}`;
          // --- End thumbnail generation ---

          resultData = { name: `${base}.ico`, path: outPath, thumbnail: thumbnailDataUrl };
          break;
        case 'avif':
          outPath = path.join(outDir, `${base}.avif`);
          await sharpInst.avif().toFile(outPath);
          resultData = { name: `${base}.avif`, path: outPath };
          break;
        case 'base64':
          const data = await sharpInst.png().toBuffer(); // Convert to PNG or another suitable format before Base64 encoding
          const base64String = data.toString('base64');
          resultData = { name: `${base}.base64`, result: base64String };
          break;
        default:
          outPath = path.join(outDir, `${base}.png`);
          await sharpInst.png().toFile(outPath);
          resultData = { name: `${base}.png`, path: outPath };
          break;
      }
    }

    if (resultData) {
      parentPort.postMessage(resultData);
    } else {
       // Should not happen, but as a fallback
       parentPort.postMessage({ name: file.name, error: 'Unknown conversion error' });
    }
  } catch (error) {
    console.error(`Error converting ${file.name} to ${ext}:`, error);
    parentPort.postMessage({ name: file.name, error: error.message });
  }
})(); 