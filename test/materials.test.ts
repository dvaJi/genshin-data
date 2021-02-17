import GenshinData from '../src';

let currentMaterials = 0;

describe('Materials Method', () => {
  const genshinData = new GenshinData({ language: 'english' });
  it('should return only fields specified on "select"', async () => {
    const materials = await genshinData.materials({ select: ['name', 'id'] });

    expect(materials[0].id).toBeDefined();
    expect(materials[0].name).toBeDefined();

    expect(materials[0].material_type).toBeUndefined();
    expect(materials[0].type).toBeUndefined();
  });
});

describe('Materials English', () => {
  const genshinData = new GenshinData({ language: 'english' });

  it('should return all materials', async () => {
    const materials = await genshinData.materials();
    expect(materials.length).toBeGreaterThan(0);
    currentMaterials = materials.length;
  });

  it('should contains all mandatory fields', async () => {
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});

describe('Materials Spanish', () => {
  const genshinData = new GenshinData({ language: 'spanish' });

  it('should return all materials', async () => {
    const materials = await genshinData.materials();
    expect(materials.length).toEqual(currentMaterials);
  });

  it('should contains all mandatory fields', async () => {
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});

describe('Materials Japanese', () => {
  const genshinData = new GenshinData({ language: 'japanese' });

  it('should return all materials', async () => {
    const materials = await genshinData.materials();
    expect(materials.length).toEqual(currentMaterials);
  });

  it('should contains all mandatory fields', async () => {
    const materials = await genshinData.materials();

    for (const material of materials) {
      expect(material.id).toBeDefined();
      expect(material.name).toBeDefined();
    }
  });
});
