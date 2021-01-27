import GenshinData from '../src';

describe('Materials English', () => {
  it('should return all materials', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const materials = await genshinData.materials();
    expect(materials.length).toEqual(117);
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
    expect(materials.length).toEqual(85);
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
