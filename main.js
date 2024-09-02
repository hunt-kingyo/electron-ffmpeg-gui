const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'マイアプリ',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  //単一の入力ファイルのパスを保存するための変数
  let inputFilePath = '';
  //入力ファイルのリスト
  let inputFileList = [];
  let videoCodec = 'libx264';
  let options = '';
  let bitrate = '';
  let container = '';
  let outputFilePath = 'C:/Users/BO-hu/Downloads/testoutput.mp4';

  ipcMain.handle('multi-open-dialog', async (_e, _arg) => {
    return dialog
      // ファイル選択ダイアログを表示する
      .showOpenDialog(mainWindow, {
        properties: ['openFile','multiSelections'],
      })
      .then((result) => {
        // キャンセルボタンが押されたとき
        if (result.canceled) return '';

        //ファイルパスをinputFileListに保存
        result.filePaths.forEach(inputFilePath => {
          inputFileList.push(inputFilePath);
        });
        // 選択されたファイルの絶対パスのリストを返す
        return inputFileList;
      })
      .catch((err) => console.error(err));
  });

  ipcMain.handle('open-dialog', async (_e, _arg) => {
    return dialog
      // ファイル選択ダイアログを表示する
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
      })
      .then((result) => {
        // キャンセルボタンが押されたとき
        if (result.canceled) return '';

        inputFilePath = result.filePaths[0];
        // 選択されたファイルの絶対パスを返す
        return result.filePaths[0];
      })
      .catch((err) => console.error(err));
  });

  ipcMain.handle('start-ffmpeg', async (_e, _arg) => {
    ffmpeg(inputFilePath)
      .videoCodec(videoCodec)
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', function() {
        console.log('Processing finished !');
      })
      .save(outputFilePath)
    return 'Processing finished!'
  })

  mainWindow.webContents.openDevTools({ mode: 'detach' });
  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());