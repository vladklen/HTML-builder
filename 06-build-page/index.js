const fs = require('fs');
const path = require('path');
const { pipeline } = require('node:stream/promises');

let newPath = path.join(__dirname, 'project-dist');
let oldPath = path.join(__dirname, 'assets');
const cssPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const bundle = fs.createWriteStream(`${newPath}/style.css`);
let htmlContent = '';

async function readHtml(fileName) {
  const data = await fs.promises.readFile(fileName, { encoding: 'utf8' });
  return data.toString();
}

function generateHtml() {
  readHtml(path.join(__dirname, 'template.html')).then((result) => {
    htmlContent = result;
    const data = fs.promises.readdir(componentsPath).then((data) => {
      data.forEach((file) => {
        if (file.split('.')[1] === 'html') {
          let tag = file.split('.')[0];
          readHtml(`${componentsPath}/${file}`)
            .then((result) => {
              htmlContent = htmlContent.replace(`{{${tag}}}`, result);
            })
            .then(() => {
              const indexHtml = fs.createWriteStream(`${newPath}/index.html`);
              fs.writeFile(`${newPath}/index.html`, htmlContent, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
        }
      });
    });
  });
}

fs.promises.readdir(cssPath).then((data) => {
  data.forEach((file) => {
    if (file.toString().split('.')[1] === 'css') {
      const stream = fs.createReadStream(`${cssPath}/${file}`, 'utf-8');
      let data = '';
      stream.on('data', (chunk) => (data += chunk));
      stream.on('end', () => bundle.write(data));
    }
  });
});

fs.promises.mkdir(newPath, { recursive: true }, function (err) {
  if (err) console.log(err);
});
fs.promises.mkdir(`${newPath}/assets`, { recursive: true }, function (err) {
  if (err) console.log(err);
});

const copyDir = (path) => {
  fs.readdir(path, { withFileTypes: true }, (err, data) => {
    data.forEach((file) => {
      if (file.isFile()) {
        copyFile(file.name, path);
      } else {
        fs.promises
          .mkdir(`${path.replace('assets', 'project-dist/assets')}/${file.name}`, { recursive: true }, function (err) {
            if (err) console.log(err);
          })
          .then(() => {})
          .then(() => copyDir(`${path}/${file.name}`));
      }
    });
  });
};

const copyFile = (file, path) => {
  fs.copyFile(`${path}/${file}`, `${path.replace('assets', 'project-dist/assets')}/${file}`, (err) => {
    if (err) throw err;
  });
};

copyDir(oldPath);
generateHtml();
