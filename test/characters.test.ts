import GenshinData, { languages } from '../src';

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

for (const language of languages) {
  describe(`Characters ${language}`, () => {
    const genshinData = new GenshinData({ language });

    it('should return all characters', async () => {
      const characters = await genshinData.characters();
      expect(characters.length).toBeGreaterThan(0);

      if (currentCharacters === 0) {
        currentCharacters = characters.length;
      }

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

    it('all skills must contains 15 attribute values', async () => {
      const characters = await genshinData.characters();

      for (const character of characters) {
        for (const skill of character.skills) {
          // Mona SP skill must be skipped
          if (skill.id === 'illusory_torrent') {
            continue;
          }

          for (const attribute of skill.attributes) {
            if (attribute[1].length < 15) {
              fail(
                `Skill [${skill.id}] attribute [${attribute[0]}] of ${character.id} must have 15 attributes`
              );
            }
          }
        }
      }
    });
  });
}
