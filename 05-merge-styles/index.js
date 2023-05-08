const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const newPath = path.join(__dirname, 'project-dist');
const oldPath = path.join(__dirname, 'styles');

const bundle = fs.createWriteStream(`${newPath}/bundle.css`);

fs.promises.readdir(oldPath).then((data) => {
  data.forEach((file) => {
    if (file.toString().split('.')[1] === 'css') {
      const stream = fs.createReadStream(`${oldPath}/${file}`, 'utf-8');
      let data = '';
      stream.on('data', (chunk) => (data += chunk));
      stream.on('end', () => bundle.write(data));
    }
  });
});
