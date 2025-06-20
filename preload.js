// Простой preload для Electron
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  convertFiles: (files, format) => ipcRenderer.invoke('convert-files', files, format),
  downloadFile: (filePath, fileName) => ipcRenderer.invoke('download-file', filePath, fileName),
  downloadMultipleFiles: (files) => ipcRenderer.invoke('download-multiple-files', files),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});

window.addEventListener('DOMContentLoaded', () => {

}); 