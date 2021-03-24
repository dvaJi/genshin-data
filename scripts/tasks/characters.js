const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { deepMerge } = require('./utils');

const DATA_PATH = path.join(__dirname, '..', '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', '..', 'src', 'generated');

const log = console.log;

async function generateCharacters(lang) {
  const folder = 'characters';
  let index = [];
  try {
    const folderPath = path.join(
      DATA_PATH,
      lang === 'english' ? 'general' : lang,
      folder
    );
    fs.readdirSync(folderPath).forEach(filename => {
      if (!filename.endsWith('.json')) return;
      const data = require(path.join(folderPath, filename));
      // const originalData = require(path.join(
      //   DATA_PATH,
      //   'general',
      //   folder,
      //   filename
      // ));

      // let fmtData = deepMerge(originalData, data);
      index.push(data);
    });

    fs.writeFileSync(
      path.join(GENERATED_PATH, lang, `${folder}.json`),
      JSON.stringify(index, null, '\t')
    );

    log(chalk.green(`[✓] ${folder}.json created`));
  } catch (err) {
    console.error(err);
  }

  return index;
}

exports.default = generateCharacters;
