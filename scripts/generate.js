import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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
        const file = fs.readFileSync(path.join(GENERATED_PATH, lang, folder));
        data[folder.replace('.json', '')].push(JSON.parse(file.toString()));
        continue;
      }

      fs.readdirSync(`${GENERATED_PATH}/${lang}/${folder}`).forEach(
        (filename) => {
          if (!filename.endsWith('.json')) return;
          const file = fs.readFileSync(
            path.join(GENERATED_PATH, lang, folder, filename)
          );
          data[folder].push(JSON.parse(file.toString()));
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

  console.log('Done');
}

combineData();
