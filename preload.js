// Простой preload для Electron
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  convertFiles: (files, format, resize) => ipcRenderer.invoke('convert-files', files, format, resize),
  downloadFile: (filePath, fileName) => ipcRenderer.invoke('download-file', filePath, fileName),
  downloadMultipleFiles: (files) => ipcRenderer.invoke('download-multiple-files', files),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  removeBg: (files) => ipcRenderer.invoke('remove-bg', files)
});

window.addEventListener('DOMContentLoaded', () => {

}); 