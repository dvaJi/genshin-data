import GenshinData, { languages } from '../src';

let currentArtifacts = 0;

describe('Artifacts Method', () => {
  const genshinData = new GenshinData({ language: 'english' });
  it('should return only fields specified on "select"', async () => {
    const artifacts = await genshinData.artifacts({ select: ['name', 'id'] });

    expect(artifacts[0].id).toBeDefined();
    expect(artifacts[0].name).toBeDefined();

    expect(artifacts[0].max_rarity).toBeUndefined();
    expect(artifacts[0].min_rarity).toBeUndefined();
  });
});

for (const language of languages) {
  describe(`Artifacts ${language}`, () => {
    const genshinData = new GenshinData({ language });

    it('should return all artifacts', async () => {
      const artifacts = await genshinData.artifacts();
      expect(artifacts.length).toBeGreaterThan(0);

      if (currentArtifacts === 0) {
        currentArtifacts = artifacts.length;
      }

      expect(artifacts.length).toEqual(currentArtifacts);
    });

    it('should contains all mandatory fields', async () => {
      const artifacts = await genshinData.artifacts();

      for (const artifact of artifacts) {
        expect(artifact.id).toBeDefined();
        expect(artifact.name).toBeDefined();
      }
    });
  });
}
