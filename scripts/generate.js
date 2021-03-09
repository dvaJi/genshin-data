const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const { deepMerge, slugify } = require('./tasks/utils');
const { default: Datastore, dataCache } = require('./data-store');
const generateCharacters = require('./tasks/characters').default;
const generateArtifacts = require('./tasks/artifacts').default;
const generateWeapons = require('./tasks/weapons').default;

const DATA_PATH = path.join(__dirname, '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', 'src', 'generated');

const LANGUAGES = ['english', 'spanish', 'japanese'];

const log = console.log;

const store = new Datastore();

async function main() {
  log('Init script...');

  // Iterate through each language
  for await (const lang of LANGUAGES) {
    log(chalk.yellow(`Creating files for [${lang}] content:`));

    getCommon(lang);
    store.setCurrentData(generateMaterials(lang), 'materials', lang);
    await generateArtifacts(lang);
    await generateWeapons(lang);
    await generateCharacters(lang);
  }
}

function getCommon(lang) {
  const filename = 'common.json';
  const commonPath = getFolder(lang, '');
  const map = new Map();
  const data = require(path.join(commonPath, filename));
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      map.set(key, data[key]);
      dataCache.set(`common_${lang}_${key}`, data[key]);
    }
  }

  log(chalk.green(`[✓] common.json loaded`));
  return map;
}

function generateMaterials(lang) {
  const materialsMap = new Map();
  const materials = [];
  const materialsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'materials'
  );
  fs.readdirSync(materialsPath).forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(materialsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'materials',
      filename
    ));

    let fmtData = deepMerge(originalData, data);

    if (originalData.type === 'Ascension Gems Material') {
      originalData.quality.forEach((quality, index) => {
        const tlMaterial = data.quality[index];
        let material = {
          ...deepMerge(quality, tlMaterial),
          type: originalData.type,
          material_type: originalData.material_type,
          gem_type: data.name,
        };

        materialsMap.set(material.id, material.name);
        materials.push(material);
        dataCache.set(`material_${lang}_${material.id}`, material);
      });
    } else {
      materialsMap.set(fmtData.id, fmtData.name);
      materials.push(fmtData);
      dataCache.set(`material_${lang}_${fmtData.id}`, fmtData);
    }
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `materials.json`),
    JSON.stringify(materials, null, '\t')
  );

  log(chalk.green(`[✓] materials.json created`));

  return materialsMap;
}

function getFolder(lang, folder) {
  return path.join(DATA_PATH, lang === 'english' ? 'general' : lang, folder);
}

main();
