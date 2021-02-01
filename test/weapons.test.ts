import GenshinData from '../src';

let currentWeapons = 0;

describe('Weapons English', () => {
  it('should return all weapons', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const weapons = await genshinData.weapons();
    expect(weapons.length).toBeGreaterThan(0);
    currentWeapons = weapons.length;
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const weapons = await genshinData.weapons();

    for (const weapon of weapons) {
      expect(weapon.id).toBeDefined();
      expect(weapon.name).toBeDefined();
    }
  });
});

describe('Weapons Spanish', () => {
  it('should return all weapons', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const weapons = await genshinData.weapons();
    expect(weapons.length).toEqual(currentWeapons);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const weapons = await genshinData.weapons();

    for (const weapon of weapons) {
      expect(weapon.id).toBeDefined();
      expect(weapon.name).toBeDefined();
    }
  });
});
