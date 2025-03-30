import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, basename, extname } from 'path'
import { existsSync } from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import getExt from './getExt'

interface AllOptions {
  inputFileList:string[];
  videoCodec:string;
  codecOption:string[];
  containerFormat:string;
  suffix: string;
  outputFolder:string;
}
//ビルド後はasarのせいでうまくffmpegのパスが見つからないため、ビルド後にも上手く動作するよう変更
//型安全性のため、ffmpegStaticがない時はundefinedになる
ffmpeg.setFfmpegPath(ffmpegStatic ? ffmpegStatic.replace('app.asar', 'app.asar.unpacked'):undefined)

function createWindow(): void {
  // Create the browser window.
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

  //入力ファイルのリスト
  let outputFolder: string = ''
  //オプションは['-option param',]または['-option', 'param',]の形で渡す
  //文字列が送られてくるが、どうせ配列でffmpegに渡す必要があるためこうした
  let options: string[] = []
  let outputFilePath = ''

  ipcMain.handle('open-multiple-dialog', async () => {
    const inputList:string[] = []
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
            inputList.push(inputFilePath)
          })
          // 選択されたファイルの絶対パスのリストを返す
          return inputList
        })
        .catch((err) => console.error(err))
    )
  })

  ipcMain.handle('open-output-dialog', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      .then((result): string => {
        if (result.canceled) return ''

        outputFolder = result.filePaths[0]
        console.log(outputFolder)
        return outputFolder
      })
      .catch((err) => console.error(err))
  })

  ipcMain.on('start-ffmpeg', async (_e, allOptions: AllOptions) => {
    const {
      inputFileList: inputFileList,
      videoCodec: videoCodec, 
      codecOption: option, 
      containerFormat: format,
      suffix: suffix,
      outputFolder: outputFolder,
    } = allOptions
     
    
    // 一つの変換処理をPromiseでラップする関数
    const encodePromise = (inputFilePath: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (outputFolder == '') {
          console.log('output folder is not selected.')
          mainWindow.webContents.send('ffmpeg-log', 'output folder is not selected.')
          reject(new Error('Output folder is not selected.'))
          return
        }
        
        outputFilePath =
          join(outputFolder, basename(inputFilePath, extname(inputFilePath))) + suffix + getExt(format)
        
        //将来的にユーザーがオプションを任意に追加する機能を付けるために一度配列をコピーしている
        options = [...option]
        
        if (existsSync(outputFilePath)) {
          const checkPathResult = 
            `file already exists: ${outputFilePath}\n\
            select suffix, or other output folder.\n`
          mainWindow.webContents.send('ffmpeg-log', checkPathResult)
          console.log('file already exists\n')
          reject(new Error('File already exists.'))
        } else {
          ffmpeg(inputFilePath)
            .videoCodec(videoCodec)
            .outputOption(options)
            .format(format)
            .on('progress', function (progress) {
              const intProgress = parseInt(progress.percent)
              console.log('Processing: ' + intProgress + '% done')
              mainWindow.webContents.send('ffmpeg-log', 'Processing: ' + intProgress + '% done')
            })
            .on('error', function (err: { message: string }) {
              console.log('An error occurred: ' + err.message)
              mainWindow.webContents.send('ffmpeg-log', 'An error occurred: ' + err.message)
              reject(err) // エラー時にPromiseをreject
            })
            .on('end', function () {
              console.log('Processing finished !')
              mainWindow.webContents.send('ffmpeg-log', 'Processing finished !')
              resolve() // 処理完了時にPromiseをresolve
            })
            .save(outputFilePath)
        }
      })
    }

    // ファイルリストを順番に処理する非同期関数
    const processSequentially = async (fileList: string[]) => {
      for (const inputFile of fileList) {
        try {
          console.log(`Start processing file: ${inputFile}`)
          mainWindow.webContents.send('ffmpeg-log', `Start processing file: ${inputFile}`)
          
          // ファイルの処理が完了するまで待機
          await encodePromise(inputFile)
          
          console.log(`Completed processing: ${inputFile}`)
          mainWindow.webContents.send('ffmpeg-log', `Completed processing: ${inputFile}`)
        } catch (error) {
          console.error(`Error processing ${inputFile}:`, error)
          mainWindow.webContents.send('ffmpeg-log', `Error processing ${inputFile}: ${(error as Error).message}`)
          // エラーが発生したら次のファイルへ
        }
      }
      console.log('All files processed!')
      mainWindow.webContents.send('ffmpeg-log', 'All files processed!')
    }

    // 実行
    processSequentially(inputFileList);
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
