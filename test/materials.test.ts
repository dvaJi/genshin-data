import GenshinData from '../src';

let currentMaterials = 0;

describe('Materials English', () => {
  it('should return all materials', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const materials = await genshinData.materials();
    expect(materials.length).toBeGreaterThan(0);
    currentMaterials = materials.length;
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});

describe('Materials Spanish', () => {
  it('should return all materials', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const materials = await genshinData.materials();
    expect(materials.length).toEqual(currentMaterials);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});

describe('Materials Japanese', () => {
  it('should return all materials', async () => {
    const genshinData = new GenshinData({ language: 'japanese' });
    const materials = await genshinData.materials();
    expect(materials.length).toEqual(currentMaterials);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'japanese' });
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});
