import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('myAPI', {
      openDialog: () => ipcRenderer.invoke('open-dialog'),
      openMultipleDialog: () => ipcRenderer.invoke('open-multiple-dialog'),
      openOutputDialog: () => ipcRenderer.invoke('open-output-dialog'),
      selectCodec: (codec: string) => ipcRenderer.send('select-codec', codec),
      selectSuffix: (suffix: string) => ipcRenderer.send('select-suffix', suffix),
      selectOption: (option: string) => ipcRenderer.send('select-option', option),
      selectFormat: (format: string) => ipcRenderer.send('select-format', format),
      startFfmpeg: () => ipcRenderer.send('start-ffmpeg'),
      checkFilePath: (callback) =>
        ipcRenderer.on('check-file-path', (_event, message: string) => {
          callback(message)
        }),
      ffmpegLog: (callback) =>
        ipcRenderer.on('ffmpeg-log', (_event, message: string) => {
          callback(message)
        })
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
