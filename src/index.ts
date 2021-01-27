import { Artifact } from './types/artifact';
import { Character } from './types/character';
import { Weapon } from './types/weapon';

export interface Options {
  language: 'english' | 'spanish';
}

export default class GenshinData {
  options: Options = {
    language: 'english',
  };

  constructor(opts?: Options) {
    if (opts) {
      this.options = { ...this.options, ...opts };
    }
  }

  setOptions(opts: Options) {
    this.options = { ...this.options, ...opts };
  }

  getOptions(): Options {
    return this.options;
  }

  async characters(): Promise<Character[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/characters.json`)).default;
    } else {
      return (await import(`./generated/english/characters.json`)).default;
    }
  }

  async weapons(): Promise<Weapon[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/weapons.json`)).default;
    } else {
      return (await import(`./generated/english/weapons.json`)).default;
    }
  }

  async artifacts(): Promise<Artifact[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/artifacts.json`)).default;
    } else {
      return (await import(`./generated/english/artifacts.json`)).default;
    }
  }

  async materials(): Promise<any[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/materials.json`)).default;
    } else {
      return (await import(`./generated/english/materials.json`)).default;
    }
  }
}
