import GenshinData from '../src';

let currentCharacters = 0;

describe('Characters Method', () => {
  const genshinData = new GenshinData({ language: 'english' });
  it('should return only fields specified on "select"', async () => {
    const characters = await genshinData.characters({ select: ['name', 'id'] });

    expect(characters[0].id).toBeDefined();
    expect(characters[0].name).toBeDefined();

    expect(characters[0].description).toBeUndefined();
    expect(characters[0].skills).toBeUndefined();
    expect(characters[0].passives).toBeUndefined();
  });
});

describe('Characters English', () => {
  const genshinData = new GenshinData({ language: 'english' });

  it('should return all characters', async () => {
    const characters = await genshinData.characters();
    expect(characters.length).toBeGreaterThan(0);
    currentCharacters = characters.length;
  });

  it('should contains all mandatory fields', async () => {
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
  const genshinData = new GenshinData({ language: 'spanish' });

  it('should return all characters', async () => {
    const characters = await genshinData.characters();
    expect(characters.length).toEqual(currentCharacters);
  });

  it('should contains all mandatory fields', async () => {
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

describe('Characters Japanese', () => {
  const genshinData = new GenshinData({ language: 'japanese' });

  it('should return all characters', async () => {
    const characters = await genshinData.characters();
    expect(characters.length).toEqual(currentCharacters);
  });

  it('should contains all mandatory fields', async () => {
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
