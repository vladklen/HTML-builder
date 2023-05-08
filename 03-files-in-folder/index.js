const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, data) => {
  data.forEach((file) => {
    if (file.isFile()) {
      console.log(
        file.name.split('.')[0] +
          ' - ' +
          path.extname(file.name).split('.')[1] +
          ' - ' +
          fs.statSync(`${dirPath}/${file.name}`).size +
          ' bytes'
      );
    }
  });
});
