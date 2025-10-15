const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStorage: () => ipcRenderer.invoke('get-storage'),
  setStorage: (data) => ipcRenderer.invoke('set-storage', data),
});