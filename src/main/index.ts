import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, basename, extname } from 'path'
import { existsSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import getExt from './getExt'
import { resolveFfmpegPath } from './ffmpeg/resolveFfmpegPath'
import { runFfmpeg } from './ffmpeg/runFfmpeg'
import type { AllOptions, RunFfmpegResult } from './ffmpeg/types'

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

  const sendFfmpegLog = (message: string) => {
    console.log(message)
    mainWindow.webContents.send('ffmpeg-log', message)
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
    const {
      inputFileList,
      videoCodec,
      codecOption,
      containerFormat,
      suffix,
      outputFolder
    } = allOptions
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

      try {
        sendFfmpegLog(`Start processing file: ${inputFilePath}`)
        mainWindow.webContents.send('ffmpeg-status', {
          type: 'start',
          message: `Start processing file: ${inputFilePath}`,
          inputFilePath,
          outputFilePath
        })

        if (existsSync(outputFilePath)) {
          throw new Error(`file already exists: ${outputFilePath}\nselect suffix, or other output folder.`)
        }

        await runFfmpeg({
          ffmpegPath,
          inputFilePath,
          outputFilePath,
          videoCodec,
          codecOptions: codecOption,
          containerFormat,
          onLog: sendFfmpegLog,
          onProgress: (progress) => mainWindow.webContents.send('ffmpeg-progress', progress)
        })

        sendFfmpegLog(`Completed processing: ${inputFilePath}`)
        mainWindow.webContents.send('ffmpeg-status', {
          type: 'finish',
          message: `Completed processing: ${inputFilePath}`,
          inputFilePath,
          outputFilePath
        })
        results.push({ inputFilePath, outputFilePath, success: true })
      } catch (error) {
        const errorMessage = (error as Error).message
        console.error(`Error processing ${inputFilePath}:`, error)
        sendFfmpegLog(`Error processing ${inputFilePath}: ${errorMessage}`)
        mainWindow.webContents.send('ffmpeg-status', {
          type: 'error',
          message: errorMessage,
          inputFilePath,
          outputFilePath
        })
        results.push({ inputFilePath, outputFilePath, success: false, errorMessage })
      }
    }

    sendFfmpegLog('All files processed!')
    mainWindow.webContents.send('ffmpeg-status', {
      type: 'all-finished',
      message: 'All files processed!'
    })
    return results
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
