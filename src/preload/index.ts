import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface AllOptions {
  inputFileList:string[];
  videoCodec:string;
  codecOption:string;
  containerFormat:string;
  suffix: string;
  outputFolder:string;
}

// Custom APIs for renderer
const myAPI =  {
  openMultipleDialog: () => ipcRenderer.invoke('open-multiple-dialog'),
  openOutputDialog: () => ipcRenderer.invoke('open-output-dialog'),
  selectCodec: (codec: string) => ipcRenderer.send('select-codec', codec),
  selectSuffix: (suffix: string) => ipcRenderer.send('select-suffix', suffix),
  selectOption: (option: string) => ipcRenderer.send('select-option', option),
  selectFormat: (format: string) => ipcRenderer.send('select-format', format),
  startFfmpeg: (allOptions: AllOptions) => ipcRenderer.send('start-ffmpeg', allOptions),
  ffmpegLog: (callback: (message: string) => void) => {
    const logHandler = (_e, message: string) => {
      callback(message);
    }

    ipcRenderer.on('ffmpeg-log', logHandler)

    return () => {
      ipcRenderer.removeListener('ffmpeg-log', logHandler);
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('myAPI',myAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
