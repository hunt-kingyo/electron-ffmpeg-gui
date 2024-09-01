console.log('Hello, world.');
const button = document.getElementById('button');
const text = document.getElementById('text');
button.addEventListener('click', async () => {
    text.textContent = await window.myAPI.openDialog();
});