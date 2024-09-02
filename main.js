const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'マイアプリ',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  let inputFileList = [];

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

        // 選択されたファイルの絶対パスを返す
        return result.filePaths[0];
      })
      .catch((err) => console.error(err));
  });

  mainWindow.webContents.openDevTools({ mode: 'detach' });
  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());