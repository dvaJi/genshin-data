import GenshinData from '../src';

describe('Characters English', () => {
  it('should return all characters', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const characters = await genshinData.characters();
    expect(characters.length).toEqual(30);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const characters = await genshinData.characters();

    for (const character of characters) {
      expect(character.id).toBeDefined();
      expect(character.name).toBeDefined();
      expect(character.description).toBeDefined();
      expect(character.skills.length).toBeGreaterThan(0);
      expect(character.passives.length).toBeGreaterThan(0);
    }
  });
});

describe('Characters Spanish', () => {
  it('should return all characters', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const characters = await genshinData.characters();
    expect(characters.length).toEqual(30);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const characters = await genshinData.characters();

    for (const character of characters) {
      expect(character.id).toBeDefined();
      expect(character.name).toBeDefined();
    }
  });
});
