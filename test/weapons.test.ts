import GenshinData from '../src';

let currentWeapons = 0;

describe('Weapons Method', () => {
  const genshinData = new GenshinData({ language: 'english' });
  it('should return only fields specified on "select"', async () => {
    const weapons = await genshinData.weapons({ select: ['name', 'id'] });

    expect(weapons[0].id).toBeDefined();
    expect(weapons[0].name).toBeDefined();

    expect(weapons[0].description).toBeUndefined();
    expect(weapons[0].type).toBeUndefined();
  });
});

describe('Weapons English', () => {
  const genshinData = new GenshinData({ language: 'english' });

  it('should return all weapons', async () => {
    const weapons = await genshinData.weapons();
    expect(weapons.length).toBeGreaterThan(0);
    currentWeapons = weapons.length;
  });

  it('should contains all mandatory fields', async () => {
    const weapons = await genshinData.weapons();

    for (const weapon of weapons) {
      expect(weapon.id).toBeDefined();
      expect(weapon.name).toBeDefined();
    }
  });
});

describe('Weapons Spanish', () => {
  const genshinData = new GenshinData({ language: 'spanish' });

  it('should return all weapons', async () => {
    const weapons = await genshinData.weapons();
    expect(weapons.length).toEqual(currentWeapons);
  });

  it('should contains all mandatory fields', async () => {
    const weapons = await genshinData.weapons();

    for (const weapon of weapons) {
      expect(weapon.id).toBeDefined();
      expect(weapon.name).toBeDefined();
    }
  });
});

describe('Weapons Japanese', () => {
  const genshinData = new GenshinData({ language: 'japanese' });

  it('should return all weapons', async () => {
    const weapons = await genshinData.weapons();
    expect(weapons.length).toEqual(currentWeapons);
  });

  it('should contains all mandatory fields', async () => {
    const weapons = await genshinData.weapons();

    for (const weapon of weapons) {
      expect(weapon.id).toBeDefined();
      expect(weapon.name).toBeDefined();
    }
  });
});
