import GenshinData from '../src';

describe('Tierlist English', () => {
  it('should return the tierlist', async () => {
    const genshinData = new GenshinData({ language: 'english' });
    const tierlist = await genshinData.tierlist();
    expect(tierlist).toBeDefined();
  });
});

describe('Tierlist Spanish', () => {
  it('should return the tierlist', async () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    const tierlist = await genshinData.tierlist();
    expect(tierlist).toBeDefined();
  });
});

describe('Tierlist Japanese', () => {
  it('should return the tierlist', async () => {
    const genshinData = new GenshinData({ language: 'japanese' });
    const tierlist = await genshinData.tierlist();
    expect(tierlist).toBeDefined();
  });
});
