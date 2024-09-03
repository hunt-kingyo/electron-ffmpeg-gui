console.log('Hello, world.');
const button = document.getElementById('button');
const text = document.getElementById('text');

const inputlist = document.getElementById('inputList');
const multiImporButton = document.getElementById('multiImportButton');

const codecSelect = document.getElementById('codecSelect');

const outputButton = document.getElementById('outputButton');
const outputFolder = document.getElementById('outputFolder');

const encodeButton = document.getElementById('encodeButton');
const ffmpegLog = document.getElementById('ffmpegLog');

//ここで宣言しないとボタンを押すたびにカウントがリセットされてしまう
let count = 0;

button.addEventListener('click', async () => {
    text.textContent = await window.myAPI.openDialog();
});

multiImporButton.addEventListener('click', async () => {
    const filelist = await window.myAPI.openMultipleDialog();
    filelist.forEach(filepath => {
        //インポートしたファイルの数を数える
        count += 1;
        //\nを扱えるのはinnerTextだけで、textContentは<br>を挿入すれば動く
        inputlist.innerText = inputlist.innerText + String(count) + '. ' + filepath + '\n'
    });
})

codecSelect.addEventListener('change', (e) => {
    window.myAPI.selectCodec(e.target.value);
})

outputButton.addEventListener('click', async () => {
    outputFolder.textContent = await window.myAPI.openOutputDialog()
})

encodeButton.addEventListener('click', () => {
    window.myAPI.startFfmpeg();
    window.myAPI.ffmpegLog((message) => {
        ffmpegLog.innerText = message;
    });
})