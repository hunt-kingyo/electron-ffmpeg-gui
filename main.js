const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'FFmpegGUI',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  //単一の入力ファイルのパスを保存するための変数
  let inputFilePath = '';
  //入力ファイルのリスト
  let inputFileList = [];
  let outputFolder = '';
  let videoCodec = 'libx264';
  let options = '';
  let bitrate = '';
  //containerは拡張子が入る予定だが、ffmpegで指定できるフォーマットの名前が拡張子と一致しているか確認する必要がある
  let container = 'mov';
  let outputFilePath = outputFolder + '\\' + path.basename(inputFilePath, path.extname(inputFilePath) + '.' + container);

  ipcMain.handle('open-multiple-dialog', async (_e, _arg) => {
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

  ipcMain.handle('open-output-dialog', async(_e, _arg) => {
    return dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (result.canceled) return '';

      outputFolder = result.filePaths[0];
      let outputFilePath = outputFolder + '\\' + path.basename(inputFilePath, path.extname(inputFilePath) + '.' + container);
      return outputFilePath
    })
    .catch((err) => console.error(err));
  });

  ipcMain.on('start-ffmpeg', async (_e, _arg) => {
    ffmpeg(inputFilePath)
      .videoCodec(videoCodec)
      //containerでよいか要確認
      //ここで指定する必要がない可能性もある
      .format(container)
      .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done');
        mainWindow.webContents.send('ffmpeg-log', 'Processing: ' + progress.percent + '% done');
      })
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        mainWindow.webContents.send('ffmpeg-log', 'An error occurred: ' + err.message);
        //エラー文をどこかに送るなら
        //mainWindow.webContents.send('ffmpeg-log', 'An error occurred: ' + err.message);
      })
      .on('end', function() {
        console.log('Processing finished !');
        mainWindow.webContents.send('ffmpeg-log', 'Processing finished !');
      })
      .save(outputFilePath)
  })

  mainWindow.webContents.openDevTools({ mode: 'detach' });
  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());