const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '..', 'src', 'data');
const MIN_PATH = path.join(__dirname, '..', 'src', 'min');

function combineData() {
  const languages = fs.readdirSync(GENERATED_PATH);
  for (const lang of languages) {
    const folders = fs.readdirSync(path.join(GENERATED_PATH, lang));
    let data = {};
    for (const folder of folders) {
      if (!fs.existsSync(path.join(GENERATED_PATH, lang, folder))) continue;
      data[folder.replace('.json', '')] = [];

      if (folder.endsWith('.json')) {
        data[folder.replace('.json', '')].push(
          require(path.join(GENERATED_PATH, lang, folder))
        );
        continue;
      }

      fs.readdirSync(`${GENERATED_PATH}/${lang}/${folder}`).forEach(
        (filename) => {
          if (!filename.endsWith('.json')) return;
          data[folder].push(
            require(path.join(GENERATED_PATH, lang, folder, filename))
          );
        }
      );
    }

    const newFilePath = path.join(MIN_PATH, `data_${lang}.min.json`);

    if (!fs.existsSync(path.dirname(newFilePath))) {
      fs.mkdirSync(path.dirname(newFilePath));
    }

    fs.writeFileSync(newFilePath, JSON.stringify(data));
    console.log(path.join(MIN_PATH), `data_${lang}.min.json`);
  }
}

combineData();
