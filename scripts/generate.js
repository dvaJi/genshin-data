const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '..', 'src', 'data');

const languages = [
  'english',
  'japanese',
  'spanish',
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
  'characters',
  'common_materials',
  'elemental_stone_materials',
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
    for (const folder of folders) {
      if (!fs.existsSync(`${GENERATED_PATH}/${lang}/${folder}`)) continue;
      let data = [];

      fs.readdirSync(`${GENERATED_PATH}/${lang}/${folder}`).forEach(
        filename => {
          if (!filename.endsWith('.json')) return;
          data.push(require(`${GENERATED_PATH}/${lang}/${folder}/${filename}`));
        }
      );

      fs.writeFileSync(
        `./src/min/data_${lang}_${folder}.min.json`,
        JSON.stringify(data)
      );
    }

    console.log(`> ${lang}`);
  }
}

combineData();
