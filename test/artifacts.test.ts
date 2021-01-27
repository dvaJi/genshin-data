import GenshinData from '../src';

describe('Artifacts English', () => {
  it('should return all artifacts', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const artifacts = await genshinData.artifacts();
    expect(artifacts.length).toEqual(31);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const artifacts = await genshinData.artifacts();

    for (const artifact of artifacts) {
      expect(artifact.id).toBeDefined();
      expect(artifact.name).toBeDefined();
    }
  });
});

describe('Artifacts Spanish', () => {
  it('should return all artifacts', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const artifacts = await genshinData.artifacts();
    expect(artifacts.length).toEqual(31);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const artifacts = await genshinData.artifacts();

    for (const artifact of artifacts) {
      expect(artifact.id).toBeDefined();
      expect(artifact.name).toBeDefined();
    }
  });
});
