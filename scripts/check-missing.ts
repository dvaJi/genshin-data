const GenshinData = require('../dist/').default;

async function main() {
  const dataEN = new GenshinData({ language: 'english' });
  const dataES = new GenshinData({ language: 'spanish' });
  const dataJP = new GenshinData({ language: 'japanese' });

  // Check characters
  const charactersES = (await dataES.characters()).map((c: any) => c.id);
  const charactersEN = (await dataEN.characters()).map((c: any) => c.id);
  const charactersJP = (await dataJP.characters()).map((c: any) => c.id);
  const missingESCharacters = charactersEN.filter(
    (c: any) => !charactersES.includes(c)
  );
  const missingJPCharacters = charactersEN.filter(
    (c: any) => !charactersJP.includes(c)
  );
  console.log('[EN] Total characters:', charactersEN.length);
  console.log('[ES] Missing characters:', missingESCharacters);
  console.log('[JP] Missing characters:', missingJPCharacters);

  // Check weapons
  const weaponsES = (await dataES.weapons()).map((c: any) => c.id);
  const weaponsJP = (await dataJP.weapons()).map((c: any) => c.id);
  const weaponsEN = (await dataEN.weapons()).map((c: any) => c.id);
  const missingESWeapons = weaponsEN.filter((c: any) => !weaponsES.includes(c));
  const missingJPWeapons = weaponsEN.filter((c: any) => !weaponsJP.includes(c));
  console.log('[EN] Total weapons:', weaponsEN.length);
  console.log('[ES] Missing weapons:', missingESWeapons);
  console.log('[JP] Missing weapons:', missingJPWeapons);

  // Check artifacts
  const artifactsES = (await dataES.artifacts()).map((c: any) => c.id);
  const artifactsJP = (await dataJP.artifacts()).map((c: any) => c.id);
  const artifactsEN = (await dataEN.artifacts()).map((c: any) => c.id);
  const missingESArtifacts = artifactsEN.filter(
    (c: any) => !artifactsES.includes(c)
  );
  const missingJPArtifacts = artifactsEN.filter(
    (c: any) => !artifactsJP.includes(c)
  );
  console.log('[EN] Total artifacts:', artifactsEN.length);
  console.log('[ES] Missing artifacts:', missingESArtifacts);
  console.log('[JP] Missing artifacts:', missingJPArtifacts);

  // Check weapons
  const materialsES = (await dataES.materials()).map((c: any) => c.id);
  const materialsJP = (await dataJP.materials()).map((c: any) => c.id);
  const materialsEN = (await dataEN.materials()).map((c: any) => c.id);
  const missingESMaterials = materialsEN.filter(
    (c: any) => !materialsES.includes(c)
  );
  const missingJPMaterials = materialsEN.filter(
    (c: any) => !materialsJP.includes(c)
  );
  console.log('[EN] Total materials:', materialsEN.length);
  console.log('[ES] Missing materials:', missingESMaterials);
  console.log('[JP] Missing materials:', missingJPMaterials);
}

main();
