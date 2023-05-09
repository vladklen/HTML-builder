const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, data) => {
  data.forEach((file) => {
    if (file.isFile()) {
      fs.stat(`${dirPath}/${file.name}`, (err, stats) => {
        const fileSize = +stats.size / 1024;
        console.log(file.name.split('.')[0] + ' - ' + path.extname(file.name).split('.')[1] + ' - ' + fileSize.toFixed(3) + ' Kb');
      });
    }
  });
});
