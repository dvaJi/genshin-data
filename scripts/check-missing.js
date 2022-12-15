const gdata = require('../dist/genshin-data');
const GenshinData = gdata.default;

const METHODS = [
  'achievements',
  'characters',
  'weapons',
  'artifacts',
  'commonMaterials',
  'elementalStoneMaterials',
  'materials',
  'food',
  'furnishings',
  'ingredients',
  'jewelsMaterials',
  'localMaterials',
  'potions',
  'talentLvlUpMaterials',
  'tcgAction',
  'tcgCharacters',
  'tcgCards',
  'weaponPrimaryMaterials',
  'weaponSecondaryMaterials',
  'domains',
];

const data = gdata.languages.reduce((obj, key) => {
  obj[key] = new GenshinData({ language: key });
  return obj;
}, {});

async function main() {
  const keys = Object.keys(data).filter((k) => k !== 'english');
  for (const method of METHODS) {
    const dataEN = await data.english[method]();
    const comp = compareData(dataEN, method);

    for (const key of keys) {
      const dataLang = await data[key][method]();
      comp(dataLang, key);
    }
  }
}

function compareData(original, collectionName) {
  const originalIds = original.map((c) => c.id);
  console.log(`[EN] Total ${collectionName}:`, original.length);

  return (loc = [], lang) => {
    const locIds = loc.map((c) => c.id);
    const missings = originalIds.filter((c) => !locIds.includes(c));
    console.log(
      `[${lang}] Missing ${collectionName}: ${missings.length}:`,
      missings
    );
  };
}

main();
