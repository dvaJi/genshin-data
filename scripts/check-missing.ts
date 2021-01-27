const GenshinData = require('../dist/').default;

async function main() {
  const dataEN = new GenshinData({ language: 'english' });
  const dataES = new GenshinData({ language: 'spanish' });

  // Check characters
  const charactersES = (await dataES.characters()).map((c: any) => c.id);
  const charactersEN = (await dataEN.characters()).map((c: any) => c.id);
  const missingCharacters = charactersEN.filter(
    (c: any) => !charactersES.includes(c)
  );
  console.log('[ES] Missing characters:', missingCharacters);

  // Check weapons
  const weaponsES = (await dataES.weapons()).map((c: any) => c.id);
  const weaponsEN = (await dataEN.weapons()).map((c: any) => c.id);
  const missingWeapons = weaponsEN.filter((c: any) => !weaponsES.includes(c));
  console.log('[ES] Missing weapons:', missingWeapons);

  // Check artifacts
  const artifactsES = (await dataES.artifacts()).map((c: any) => c.id);
  const artifactsEN = (await dataEN.artifacts()).map((c: any) => c.id);
  const missingArtifacts = artifactsEN.filter(
    (c: any) => !artifactsES.includes(c)
  );
  console.log('[ES] Missing artifacts:', missingArtifacts);

  // Check weapons
  const materialsES = (await dataES.materials()).map((c: any) => c.id);
  const materialsEN = (await dataEN.materials()).map((c: any) => c.id);
  const missingMaterials = materialsEN.filter(
    (c: any) => !materialsES.includes(c)
  );
  console.log('[ES] Missing materials:', missingMaterials);
}

main();
