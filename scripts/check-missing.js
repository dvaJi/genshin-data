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
};

async function main() {
  for (const method of METHODS) {
    const dataEN = await data.english[method]();
    const dataES = await data.spanish[method]();
    const dataJA = await data.japanese[method]();
    const comp = compareData(dataEN, method);
    comp(dataES, 'ES');
    comp(dataJA, 'JA');
  }
}

function compareData(original, collectionName) {
  const originalIds = original.map(c => c.id);
  console.log(`[EN] Total ${collectionName}:`, original.length);

  return (loc, lang) => {
    const locIds = loc.map(c => c.id);
    const missings = originalIds.filter(c => !locIds.includes(c));
    console.log(`[${lang}] Missing ${collectionName}: ${missings.length}:`, missings);
  };
}

main();
