import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, basename, extname } from 'path'
import { existsSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import getExt from './getExt'
import { resolveFfmpegPath } from './ffmpeg/resolveFfmpegPath'
import { FfmpegCancelledError, runFfmpeg } from './ffmpeg/runFfmpeg'
import { FfmpegJobManager } from './ffmpeg/FfmpegJobManager'
import type { AllOptions, RunFfmpegResult } from './ffmpeg/types'

const ffmpegJobs = new FfmpegJobManager()
let quitting = false

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  let closing = false
  const send = (channel: string, payload: unknown): void => {
    if (!mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
      mainWindow.webContents.send(channel, payload)
    }
  }

  const sendFfmpegLog = (message: string) => {
    console.log(message)
    send('ffmpeg-log', message)
  }

  ipcMain.handle('open-multiple-dialog', async () => {
    const inputList: string[] = []
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections']
      })
      .then((result) => {
        if (result.canceled) return ''

        result.filePaths.forEach((inputFilePath) => {
          inputList.push(inputFilePath)
        })
        return inputList
      })
      .catch((err) => console.error(err))
  })

  ipcMain.handle('open-output-dialog', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      .then((result): string => {
        if (result.canceled) return ''

        const outputFolder = result.filePaths[0]
        console.log(outputFolder)
        return outputFolder
      })
      .catch((err) => console.error(err))
  })

  ipcMain.handle('start-ffmpeg', async (_e, allOptions: AllOptions): Promise<RunFfmpegResult[]> => {
    if (closing || quitting) throw new Error('The application is closing.')

    return ffmpegJobs.run(async (signal) => {
      const { inputFileList, videoCodec, codecOption, containerFormat, suffix, outputFolder } =
        allOptions
      const results: RunFfmpegResult[] = []

      if (outputFolder === '') {
        sendFfmpegLog('output folder is not selected.')
        return inputFileList.map((inputFilePath) => ({
          inputFilePath,
          outputFilePath: '',
          success: false,
          errorMessage: 'Output folder is not selected.'
        }))
      }

      const ffmpegPath = resolveFfmpegPath()

      for (const inputFilePath of inputFileList) {
        const outputFilePath =
          join(outputFolder, basename(inputFilePath, extname(inputFilePath))) +
          suffix +
          getExt(containerFormat)

        if (signal.aborted) {
          results.push({
            inputFilePath,
            outputFilePath,
            success: false,
            cancelled: true,
            errorMessage: 'Encoding was stopped before this file was processed.'
          })
          continue
        }

        try {
          sendFfmpegLog(`Start processing file: ${inputFilePath}`)
          send('ffmpeg-status', {
            type: 'start',
            message: `Start processing file: ${inputFilePath}`,
            inputFilePath,
            outputFilePath
          })

          if (existsSync(outputFilePath)) {
            throw new Error(
              `file already exists: ${outputFilePath}\nselect suffix, or other output folder.`
            )
          }

          await runFfmpeg({
            ffmpegPath,
            inputFilePath,
            outputFilePath,
            videoCodec,
            codecOptions: codecOption,
            containerFormat,
            onLog: sendFfmpegLog,
            onProgress: (progress) => send('ffmpeg-progress', progress),
            signal
          })

          sendFfmpegLog(`Completed processing: ${inputFilePath}`)
          send('ffmpeg-status', {
            type: 'finish',
            message: `Completed processing: ${inputFilePath}`,
            inputFilePath,
            outputFilePath
          })
          results.push({ inputFilePath, outputFilePath, success: true })
        } catch (error) {
          const errorMessage = (error as Error).message
          if (error instanceof FfmpegCancelledError) {
            sendFfmpegLog(errorMessage)
            results.push({
              inputFilePath,
              outputFilePath,
              success: false,
              cancelled: true,
              errorMessage
            })
            continue
          }
          console.error(`Error processing ${inputFilePath}:`, error)
          sendFfmpegLog(`Error processing ${inputFilePath}: ${errorMessage}`)
          send('ffmpeg-status', {
            type: 'error',
            message: errorMessage,
            inputFilePath,
            outputFilePath
          })
          results.push({ inputFilePath, outputFilePath, success: false, errorMessage })
        }
      }

      const message = signal.aborted ? 'Encoding stopped.' : 'All files processed!'
      sendFfmpegLog(message)
      send('ffmpeg-status', {
        type: signal.aborted ? 'cancelled' : 'all-finished',
        message
      })
      return results
    })
  })

  ipcMain.handle('stop-ffmpeg', () => ffmpegJobs.stop())

  mainWindow.on('close', (event) => {
    closing = true
    if (!ffmpegJobs.isRunning) return

    event.preventDefault()
    void ffmpegJobs.stop().then(() => {
      if (!mainWindow.isDestroyed()) mainWindow.close()
    })
  })

  mainWindow.on('closed', () => {
    for (const channel of [
      'open-multiple-dialog',
      'open-output-dialog',
      'start-ffmpeg',
      'stop-ffmpeg'
    ]) {
      ipcMain.removeHandler(channel)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (event) => {
  quitting = true
  if (!ffmpegJobs.isRunning) return

  event.preventDefault()
  void ffmpegJobs.stop().then(() => app.quit())
})
