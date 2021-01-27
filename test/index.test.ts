import GenshinData from '../src';

describe('GenshinData', () => {
  it('should init with default options when the constructor is empty', () => {
    const genshinData = new GenshinData();
    expect(genshinData.getOptions()).toEqual({ language: 'english' });
  });

  it('should init with options', () => {
    const genshinData = new GenshinData({ language: 'spanish' });
    expect(genshinData.getOptions()).toEqual({ language: 'spanish' });
  });
});
