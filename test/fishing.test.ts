import GenshinData, { languages } from '../src';

describe('Fishing Methods', () => {
  const genshinData = new GenshinData({ language: 'english' });
  it('should return only fields specified on "select"', async () => {
    const weapons = await genshinData.weapons({ select: ['name', 'id'] });

    expect(weapons[0].id).toBeDefined();
    expect(weapons[0].name).toBeDefined();

    expect(weapons[0].description).toBeUndefined();
    expect(weapons[0].type).toBeUndefined();
  });
});

for (const language of languages) {
  describe(`Fishing ${language}`, () => {
    const genshinData = new GenshinData({ language });

    it('should return all fish', async () => {
      const fishList = await genshinData.fish();
      for (const fish of fishList) {
        expect(fish.id).toBeDefined();
        expect(fish.name).toBeDefined();
      }
    });

    it('should return all fishing rods', async () => {
      const fishingRods = await genshinData.fishingRods();
      for (const rod of fishingRods) {
        expect(rod.id).toBeDefined();
        expect(rod.name).toBeDefined();
      }
    });

    it('should return all baits', async () => {
      const baits = await genshinData.baits();
      for (const bait of baits) {
        expect(bait.id).toBeDefined();
        expect(bait.name).toBeDefined();
      }
    });
  });
}
