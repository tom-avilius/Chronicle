
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mainWindowLoad', {

    checkFirstTimeRun: (callback) => ipcRenderer.on('run-info', callback),
    askToSortDownloads: (flag) => ipcRenderer.send('sort-downloads', flag),
    sortDownloadsBtnClick: (flag) => ipcRenderer.send('sort-downloads-click', flag),
});