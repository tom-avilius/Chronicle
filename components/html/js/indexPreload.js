
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mainWindowLoad', {
    sortDownloadsBtnClick: (flag) => ipcRenderer.send('sort-downloads-click', flag),
});