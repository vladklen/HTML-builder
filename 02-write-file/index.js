const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(`${filePath}`);

stdout.write('Введите текст:\n');
stdin.on('data', (data) => {
  const text = data.toString();
  if (text.trim() === 'exit') {
    process.exit();
  } else {
    output.write(text);
  }
});

process.on('SIGINT', function () {
  process.exit();
});

process.on('exit', () => stdout.write('Удачи!'));
