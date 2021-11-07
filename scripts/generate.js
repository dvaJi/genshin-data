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
      data[folder] = [];

      fs.readdirSync(`${GENERATED_PATH}/${lang}/${folder}`).forEach(
        filename => {
          if (!filename.endsWith('.json')) return;
          data[folder].push(
            require(path.join(GENERATED_PATH, lang, folder, filename))
          );
        }
      );
    }

    fs.writeFileSync(
      path.join(MIN_PATH, `data_${lang}.min.json`),
      JSON.stringify(data)
    );
    console.log(path.join(MIN_PATH), `data_${lang}.min.json`);
  }
}

combineData();
