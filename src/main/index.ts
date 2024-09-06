import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, basename, extname } from 'path'
import { existsSync } from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

ffmpeg.setFfmpegPath(ffmpegStatic)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  //単一の入力ファイルのパスを保存するための変数
  let inputFilePath: string = ''
  //入力ファイルのリスト
  const inputFileList: string[] = []
  let outputFolder: string = ''
  let videoCodec: string = 'libx264'
  let suffix: string = ''
  //const options: string = ''
  //const bitrate: string = ''
  //containerは拡張子が入る
  //ffmpegで指定する必要があるなら別の変数にする
  const container = '.mov'
  //string型は値が更新されないためここではあくまでstring型の変数しか定義しない
  //ラッパーオブジェクトも考えたがうまく機能しなかった
  let outputFilePath = ''

  ipcMain.handle('open-multiple-dialog', async () => {
    return (
      dialog
        // ファイル選択ダイアログを表示する
        .showOpenDialog(mainWindow, {
          properties: ['openFile', 'multiSelections']
        })
        .then((result) => {
          // キャンセルボタンが押されたとき
          if (result.canceled) return ''

          //ファイルパスをinputFileListに保存
          result.filePaths.forEach((inputFilePath) => {
            inputFileList.push(inputFilePath)
          })
          // 選択されたファイルの絶対パスのリストを返す
          return inputFileList
        })
        .catch((err) => console.error(err))
    )
  })

  ipcMain.handle('open-dialog', async () => {
    return (
      dialog
        // ファイル選択ダイアログを表示する
        .showOpenDialog(mainWindow, {
          properties: ['openFile']
        })
        .then((result) => {
          // キャンセルボタンが押されたとき
          if (result.canceled) return ''

          inputFilePath = result.filePaths[0]
          console.log(result.filePaths[0])
          // 選択されたファイルの絶対パスを返す
          return result.filePaths[0]
        })
        .catch((err) => console.error(err))
    )
  })

  ipcMain.on('select-codec', async (_e, codec: string): Promise<void> => {
    videoCodec = codec
  })

  ipcMain.on('select-suffix', async (_e, suffixSelected: string): Promise<void> => {
    suffix = suffixSelected
  })

  ipcMain.handle('open-output-dialog', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      .then((result): string => {
        if (result.canceled) return ''

        outputFolder = result.filePaths[0]
        return outputFolder
      })
      .catch((err) => console.error(err))
  })

  ipcMain.on('start-ffmpeg', async () => {
    //値を更新
    outputFilePath =
      join(outputFolder, basename(inputFilePath, extname(inputFilePath))) + suffix + container
    if (existsSync(outputFilePath)) {
      mainWindow.webContents.send(
        'check-file-path',
        `file already exists: ${outputFilePath}\n\
        select suffix, or other output folder.\n`
      )
    } else {
      mainWindow.webContents.send(
        'check-file-path',
        `--selected option--\n\
        inputFilePath: ${inputFilePath}\n\
        videoCodec: ${videoCodec}\n\
        suffix: ${suffix}\n\
        outputFilePath: ${outputFilePath}\n`
      )
      ffmpeg(inputFilePath)
        .videoCodec(videoCodec)
        //やるならcontainerではなく別の変数に変更
        //.format(container)
        .on('progress', function (progress) {
          console.log('Processing: ' + progress.percent + '% done')
          mainWindow.webContents.send('ffmpeg-log', 'Processing: ' + progress.percent + '% done')
        })
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message)
          mainWindow.webContents.send('ffmpeg-log', 'An error occurred: ' + err.message)
          //エラー文をどこかに送るなら
          //mainWindow.webContents.send('ffmpeg-log', 'An error occurred: ' + err.message);
        })
        .on('end', function () {
          console.log('Processing finished !')
          mainWindow.webContents.send('ffmpeg-log', 'Processing finished !')
        })
        .save(outputFilePath)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
