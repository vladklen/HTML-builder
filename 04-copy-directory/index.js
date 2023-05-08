const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const newPath = path.join(__dirname, 'files-copy');
const oldPath = path.join(__dirname, 'files');

const copyDir = () => {
  fs.promises.mkdir(newPath, { recursive: true }, function (err) {
    if (err) console.log(err);
  });

  fs.readdir(oldPath, (err, data) => {
    data.forEach((file) => {
      if (file.split('.')[1] && file.split('.')[1].length > 0) {
        fs.copyFile(`${oldPath}/${file}`, `${newPath}/${file}`, (err) => {
          if (err) throw err;
          console.log(`file was copied`);
        });
      }
    });
  });
};

copyDir();
