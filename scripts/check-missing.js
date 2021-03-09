const GenshinData = require('../dist').default;

async function main() {
  const dataEN = new GenshinData({ language: 'english' });
  const dataES = new GenshinData({ language: 'spanish' });
  const dataJP = new GenshinData({ language: 'japanese' });

  // Check characters
  const charactersES = (await dataES.characters()).map(c => c.id);
  const charactersEN = (await dataEN.characters()).map(c => c.id);
  const charactersJP = (await dataJP.characters()).map(c => c.id);
  const missingESCharacters = charactersEN.filter(
    c => !charactersES.includes(c)
  );
  const missingJPCharacters = charactersEN.filter(
    c => !charactersJP.includes(c)
  );
  console.log('[EN] Total characters:', charactersEN.length);
  console.log('[ES] Missing characters:', missingESCharacters);
  console.log('[JP] Missing characters:', missingJPCharacters);

  // Check weapons
  const weaponsES = (await dataES.weapons()).map(c => c.id);
  const weaponsJP = (await dataJP.weapons()).map(c => c.id);
  const weaponsEN = (await dataEN.weapons()).map(c => c.id);
  const missingESWeapons = weaponsEN.filter(c => !weaponsES.includes(c));
  const missingJPWeapons = weaponsEN.filter(c => !weaponsJP.includes(c));
  console.log('[EN] Total weapons:', weaponsEN.length);
  console.log('[ES] Missing weapons:', missingESWeapons);
  console.log('[JP] Missing weapons:', missingJPWeapons);

  // Check artifacts
  const artifactsES = (await dataES.artifacts()).map(c => c.id);
  const artifactsJP = (await dataJP.artifacts()).map(c => c.id);
  const artifactsEN = (await dataEN.artifacts()).map(c => c.id);
  const missingESArtifacts = artifactsEN.filter(c => !artifactsES.includes(c));
  const missingJPArtifacts = artifactsEN.filter(c => !artifactsJP.includes(c));
  console.log('[EN] Total artifacts:', artifactsEN.length);
  console.log('[ES] Missing artifacts:', missingESArtifacts);
  console.log('[JP] Missing artifacts:', missingJPArtifacts);

  // Check weapons
  const materialsES = (await dataES.materials()).map(c => c.id);
  const materialsJP = (await dataJP.materials()).map(c => c.id);
  const materialsEN = (await dataEN.materials()).map(c => c.id);
  const missingESMaterials = materialsEN.filter(c => !materialsES.includes(c));
  const missingJPMaterials = materialsEN.filter(c => !materialsJP.includes(c));
  console.log('[EN] Total materials:', materialsEN.length);
  console.log('[ES] Missing materials:', missingESMaterials);
  console.log('[JP] Missing materials:', missingJPMaterials);
}

main();
