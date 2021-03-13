const path = require('path');
const chalk = require('chalk');
const keyv = require('keyv');

const generateCharacters = require('./tasks/characters').default;
const generateArtifacts = require('./tasks/artifacts').default;
const generateWeapons = require('./tasks/weapons').default;
const generateMaterials = require('./tasks/materials').default;

const dataCache = new keyv();

const DATA_PATH = path.join(__dirname, '..', 'data');
const LANGUAGES = ['english', 'spanish', 'japanese'];

const log = console.log;

async function main() {
  log('Init script...');

  // Iterate through each language
  for await (const lang of LANGUAGES) {
    log(chalk.yellow(`Creating files for [${lang}] content:`));

    await getCommon(lang);
    await generateMaterials(lang, 'common_materials', dataCache);
    await generateMaterials(lang, 'elemental_stone_materials', dataCache);
    await generateMaterials(lang, 'food', dataCache);
    await generateMaterials(lang, 'ingredients', dataCache);
    await generateMaterials(lang, 'jewels_materials', dataCache);
    await generateMaterials(lang, 'local_materials', dataCache);
    await generateMaterials(lang, 'potions', dataCache);
    await generateMaterials(lang, 'talent_lvl_up_materials', dataCache);
    await generateMaterials(lang, 'weapon_primary_materials', dataCache);
    await generateMaterials(lang, 'weapon_secondary_materials', dataCache);
    await generateArtifacts(lang);
    await generateWeapons(lang);
    await generateCharacters(lang);
  }
}

async function getCommon(lang) {
  const filename = 'common.json';
  const commonPath = getFolder(lang, '');
  const map = new Map();
  const data = require(path.join(commonPath, filename));
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      map.set(key, data[key]);
      await dataCache.set(`common_${lang}_${key}`, data[key]);
    }
  }

  log(chalk.green(`[✓] common.json loaded`));
  return map;
}

function getFolder(lang, folder) {
  return path.join(DATA_PATH, lang === 'english' ? 'general' : lang, folder);
}

main();
