console.log('Hello, world.');
const button = document.getElementById('button');
const text = document.getElementById('text');
const list = document.getElementById('list');
const multiImporButton = document.getElementById('multiImportButton');
//ここで宣言しないとボタンを押すたびにカウントがリセットされてしまう
let count = 0;

button.addEventListener('click', async () => {
    text.textContent = await window.myAPI.openDialog();
});
multiImporButton.addEventListener('click', async () => {
    const filelist = await window.myAPI.multiOpenDialog();
    filelist.forEach(filepath => {
        //インポートしたファイルの数を数える
        count += 1;
        //\nを扱えるのはinnerTextだけで、textContentは<br>を挿入すれば動く
        list.innerText = list.innerText + String(count) + '. ' + filepath + '\n'
    });
})