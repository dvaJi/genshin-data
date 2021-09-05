const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '..', 'src', 'data');
const MIN_PATH = path.join(__dirname, '..', 'src', 'min');

const languages = [
  'english',
  'spanish',
  'japanese',
  'chinese-simplified',
  'chinese-traditional',
  'french',
  'german',
  'indonesian',
  'korean',
  'portuguese',
  'russian',
  'thai',
  'vietnamese',
];

const folders = [
  'artifacts',
  'bait',
  'characters',
  'common_materials',
  'elemental_stone_materials',
  'fish',
  'fishing_rod',
  'food',
  'ingredients',
  'jewels_materials',
  'local_materials',
  'potions',
  'talent_lvl_up_materials',
  'weapon_primary_materials',
  'weapon_secondary_materials',
  'weapons',
];

function combineData() {
  for (const lang of languages) {
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
