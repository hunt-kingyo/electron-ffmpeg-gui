const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    openDialog: () => ipcRenderer.invoke('open-dialog'),
    openMultipleDialog: () => ipcRenderer.invoke('open-multiple-dialog'),
    openOutputDialog: () => ipcRenderer.invoke('open-output-dialog'),
    //同期処理
    selectCodec: (codec) => ipcRenderer.send('select-codec', codec),
    selectSuffix: (suffix) => ipcRenderer.send('select-suffix', suffix),
    startFfmpeg: () => ipcRenderer.send('start-ffmpeg'),
    checkFilePath: (callback) => ipcRenderer.on('check-file-path', (_event, message) => {
        callback(message);
    }),
    ffmpegLog: (callback) => ipcRenderer.on('ffmpeg-log', (_event, message) => {
        callback(message);
    }),
}); 