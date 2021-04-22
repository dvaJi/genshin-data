const GenshinData = require('../dist').default;

const METHODS = [
  'characters',
  'weapons',
  'artifacts',
  'commonMaterials',
  'elementalStoneMaterials',
  'food',
  'ingredients',
  'jewelsMaterials',
  'localMaterials',
  'potions',
  'talentLvlUpMaterials',
  'weaponPrimaryMaterials',
  'weaponSecondaryMaterials',
];

const data = {
  english: new GenshinData({ language: 'english' }),
  spanish: new GenshinData({ language: 'spanish' }),
  japanese: new GenshinData({ language: 'japanese' }),
  'chinese-simplified': new GenshinData({ language: 'chinese-simplified' }),
  'chinese-traditional': new GenshinData({ language: 'chinese-traditional' }),
  french: new GenshinData({ language: 'french' }),
  german: new GenshinData({ language: 'german' }),
  indonesian: new GenshinData({ language: 'indonesian' }),
  korean: new GenshinData({ language: 'korean' }),
  portuguese: new GenshinData({ language: 'portuguese' }),
  russian: new GenshinData({ language: 'russian' }),
  thai: new GenshinData({ language: 'thai' }),
  vietnamese: new GenshinData({ language: 'vietnamese' }),
};

async function main() {
  const keys = Object.keys(data).filter(k => k !== 'english');
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
  const originalIds = original.map(c => c.id);
  console.log(`[EN] Total ${collectionName}:`, original.length);

  return (loc = [], lang) => {
    const locIds = loc.map(c => c.id);
    const missings = originalIds.filter(c => !locIds.includes(c));
    console.log(
      `[${lang}] Missing ${collectionName}: ${missings.length}:`,
      missings
    );
  };
}

main();
