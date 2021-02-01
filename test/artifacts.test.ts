import GenshinData from '../src';

let currentArtifacts = 0;

describe('Artifacts English', () => {
  it('should return all artifacts', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const artifacts = await genshinData.artifacts();
    expect(artifacts.length).toBeGreaterThan(0);
    currentArtifacts = artifacts.length;
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
    expect(artifacts.length).toEqual(currentArtifacts);
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

describe('Artifacts Japanese', () => {
  it('should return all artifacts', async () => {
    const genshinData = new GenshinData({ language: 'japanese' });
    const artifacts = await genshinData.artifacts();
    expect(artifacts.length).toEqual(currentArtifacts);
  });

  it('should contains all mandatory fields', async () => {
    const genshinData = new GenshinData({ language: 'japanese' });
    const artifacts = await genshinData.artifacts();

    for (const artifact of artifacts) {
      expect(artifact.id).toBeDefined();
      expect(artifact.name).toBeDefined();
    }
  });
});
