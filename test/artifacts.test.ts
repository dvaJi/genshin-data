import GenshinData from '../src';

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

describe('Artifacts English', () => {
  const genshinData = new GenshinData({ language: 'english' });

  it('should return all artifacts', async () => {
    const artifacts = await genshinData.artifacts();
    expect(artifacts.length).toBeGreaterThan(0);
    currentArtifacts = artifacts.length;
  });

  it('should contains all mandatory fields', async () => {
    const artifacts = await genshinData.artifacts();

    for (const artifact of artifacts) {
      expect(artifact.id).toBeDefined();
      expect(artifact.name).toBeDefined();
    }
  });
});

describe('Artifacts Spanish', () => {
  const genshinData = new GenshinData({ language: 'spanish' });

  it('should return all artifacts', async () => {
    const artifacts = await genshinData.artifacts();
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

describe('Artifacts Japanese', () => {
  const genshinData = new GenshinData({ language: 'japanese' });

  it('should return all artifacts', async () => {
    const artifacts = await genshinData.artifacts();
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
