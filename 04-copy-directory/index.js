const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const newPath = path.join(__dirname, 'files-copy');
const oldPath = path.join(__dirname, 'files');

const copyDir = () => {
  fsPromises.mkdir(newPath, { recursive: true }, function (err) {
    if (err) console.log(err);
  });

  fsPromises
    .readdir(newPath)
    .then((data, err) => {
      data.forEach((file) => {
        if (file.split('.')[1] && file.split('.')[1].length > 0) {
          console.log(1);
          fs.unlink(`${newPath}/${file}`, (err) => {
            if (err) throw err;
          });
        }
      });
    })
    .then(() => {
      fsPromises.readdir(oldPath).then((data, err) => {
        data.forEach((file) => {
          if (file.split('.')[1] && file.split('.')[1].length > 0) {
            console.log(2);
            fs.copyFile(`${oldPath}/${file}`, `${newPath}/${file}`, (err) => {
              if (err) throw err;
              console.log(`file was copied`);
            });
          }
        });
      });
    });
};

copyDir();
