const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    openMultipleDialog: () => ipcRenderer.invoke('open-multiple-dialog'),
    openOutputDialog: () => ipcRenderer.invoke('open-output-dialog'),
    //同期処理
    startFfmpeg: () => ipcRenderer.send('start-ffmpeg'),
    ffmpegLog: (callback) => ipcRenderer.on('ffmpeg-log', (_event, message) => {
        callback(message);
    }),
});