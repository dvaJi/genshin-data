const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { deepMerge } = require('./utils');

const DATA_PATH = path.join(__dirname, '..', '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', '..', 'src', 'generated');

const log = console.log;

async function generateMaterials(lang, folder, cache) {
  const days = await cache.get(`common_${lang}_days`);
  const regions = await cache.get(`common_${lang}_regions`);

  const materials = [];
  const materialsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    folder
  );
  fs.readdirSync(materialsPath).forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(materialsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      folder,
      filename
    ));

    let fmtData = deepMerge(originalData, data);

    if (fmtData.day) {
      fmtData.day = fmtData.day.map(d => days[d]);
    }

    if (fmtData.region) {
      fmtData.region = regions[fmtData.region];
    }

    materials.push(fmtData);
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `${folder}.json`),
    JSON.stringify(materials, null, '\t')
  );

  log(chalk.green(`[✓] ${folder}.json created`));

  return materials;
}

exports.default = generateMaterials;
