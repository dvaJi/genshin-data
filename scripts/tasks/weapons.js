const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { deepMerge } = require('./utils');

const DATA_PATH = path.join(__dirname, '..', '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', '..', 'src', 'generated');

const log = console.log;

async function generateWeapons(lang) {
  const weapons = [];
  const weaponsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'weapons'
  );
  fs.readdirSync(weaponsPath).forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(weaponsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'weapons',
      filename
    ));

    const fmtData = deepMerge(originalData, data);
    weapons.push(fmtData);
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `weapons.json`),
    JSON.stringify(weapons, null, '\t')
  );

  log(chalk.green(`[✓] weapons.json created`));

  return weapons;
}

exports.default = generateWeapons;
