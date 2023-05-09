const fs = require('fs');
const path = require('path');

const newPath = path.join(__dirname, 'project-dist');
const oldPath = path.join(__dirname, 'assets');
const cssPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
let htmlContent = '';

async function readHtml(fileName) {
  const data = await fs.promises.readFile(fileName, { encoding: 'utf8' });
  return data.toString();
}

async function changeHtml() {
  const data = await fs.promises.readdir(componentsPath).then((data) => {
    data.forEach((file) => {
      if (file.split('.')[1] === 'html') {
        let tag = file.split('.')[0];
        readHtml(`${componentsPath}/${file}`)
          .then((result) => {
            htmlContent = htmlContent.replaceAll(`{{${tag}}}`, result);
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
}

const generateHtml = () => {
  readHtml(path.join(__dirname, 'template.html'))
    .then((result) => (htmlContent = result))
    .then(() => changeHtml());
};

const createFolders = () => {
  fs.promises.mkdir(newPath, { recursive: true }, function (err) {
    if (err) console.log(err);
  });
  fs.promises.mkdir(`${newPath}/assets`, { recursive: true }, function (err) {
    if (err) console.log(err);
  });
};

const createCssBundle = () => {
  const bundle = fs.createWriteStream(`${newPath}/style.css`);
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
};

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

createFolders();
createCssBundle();
copyDir(oldPath);
generateHtml();
