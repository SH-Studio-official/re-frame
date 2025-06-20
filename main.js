// Импорт electron-reload для автоперезагрузки в режиме разработки
try {
  require('electron-reload')(__dirname);
} catch (e) {
  console.log('electron-reload не найден, автоперезагрузка отключена');
}

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const sharp = require('sharp');
const fsp = fs.promises;
const pngToIco = require('png-to-ico');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function createWindow() {
  const win = new BrowserWindow({
    width: 750,
    height: 970,
    minWidth: 740,
    minHeight: 940,
    backgroundColor: '#181818',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'frontend', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC обработчик для конвертации файлов
ipcMain.handle('convert-files', async (event, files, format) => {
  const outDir = path.join(os.tmpdir(), 'convector-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const results = await Promise.all(files.map(file => {
    return new Promise((resolve) => {
      const worker = new Worker(path.join(__dirname, 'worker-convert.js'), {
        workerData: {
          file,
          format,
          outDir
        }
      });
      worker.on('message', (result) => resolve(result));
      worker.on('error', (e) => resolve({ name: file.name, error: e.message }));
      worker.on('exit', (code) => {
        if (code !== 0) resolve({ name: file.name, error: 'Worker stopped with exit code ' + code });
      });
    });
  }));
  return results;
});

ipcMain.handle('download-file', async (event, filePath, fileName) => {
  const win = BrowserWindow.getFocusedWindow();
  const { canceled, filePath: savePath } = await dialog.showSaveDialog(win, {
    defaultPath: fileName,
    title: 'Сохранить файл',
    buttonLabel: 'Сохранить',
    filters: [{ name: 'Все файлы', extensions: ['*'] }]
  });
  if (canceled || !savePath) return { canceled: true };
  try {
    await fsp.copyFile(filePath, savePath);
    return { canceled: false, path: savePath };
  } catch (e) {
    return { canceled: false, error: e.message };
  }
});

ipcMain.handle('download-multiple-files', async (event, files) => {
  const win = BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: 'Выберите папку для сохранения',
    properties: ['openDirectory', 'createDirectory']
  });
  if (canceled || !filePaths || !filePaths[0]) return { canceled: true };
  const dir = filePaths[0];
  try {
    for (const file of files) {
      const dest = path.join(dir, file.name);
      await fs.promises.copyFile(file.path, dest);
    }
    shell.openPath(dir); // Открыть проводник
    return { canceled: false, dir };
  } catch (e) {
    return { canceled: false, error: e.message };
  }
});

ipcMain.handle('open-folder', async (event, fileOrDirPath) => {
  try {
    if (fs.existsSync(fileOrDirPath) && fs.lstatSync(fileOrDirPath).isFile()) {
      shell.showItemInFolder(fileOrDirPath);
    } else {
      shell.openPath(fileOrDirPath);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

// Обработчик для открытия внешних ссылок (например, Telegram)
ipcMain.handle('open-external', async (event, url) => {
  console.log('Opening external URL:', url);
  try {
    await shell.openExternal(url);
    console.log('URL opened successfully');
    return { ok: true };
  } catch (e) {
    console.error('Error opening URL:', e.message);
    return { ok: false, error: e.message };
  }
}); 