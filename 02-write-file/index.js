const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

try {
  if (fs.existsSync(filePath)) {
    console.log('Фаил есть');
  } else {
    fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
      if (err) throw err;
    });
  }
} catch (err) {
  console.error(err);
}

stdout.write('Введите текст:\n');
stdin.on('data', (data) => {
  const text = data.toString();
  if (text.trim() === 'exit') {
    process.exit();
  } else {
    console.log(text);
    fs.appendFileSync(filePath, `${text}`);
  }
});

process.on('SIGINT', function () {
  process.exit();
});

process.on('exit', () => stdout.write('Удачи!'));
