const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    multiOpenDialog: () => ipcRenderer.invoke('multi-open-dialog'),
    //同期処理
    startFfmpeg: () => ipcRenderer.send('start-ffmpeg')
});