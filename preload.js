const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    multiOpenDialog: () => ipcRenderer.invoke('multi-open-dialog'),
    startFfmpeg: () => ipcRenderer.invoke('start-ffmpeg')
});