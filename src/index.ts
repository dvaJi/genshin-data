import { Artifact } from './types/artifact';
import { Character } from './types/character';
import { Material } from './types/material';
import { Tierlist } from './types/tierlist';
import { Weapon } from './types/weapon';

export { Artifact, Character, Weapon, Material };

export interface Options {
  language: 'english' | 'spanish' | 'japanese';
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
    } else if (this.options.language === 'japanese') {
      return (await import(`./generated/japanese/characters.json`)).default;
    } else {
      return (await import(`./generated/english/characters.json`)).default;
    }
  }

  async weapons(): Promise<Weapon[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/weapons.json`)).default;
    } else if (this.options.language === 'japanese') {
      return (await import(`./generated/japanese/weapons.json`)).default;
    } else {
      return (await import(`./generated/english/weapons.json`)).default;
    }
  }

  async artifacts(): Promise<Artifact[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/artifacts.json`)).default;
    } else if (this.options.language === 'japanese') {
      return (await import(`./generated/japanese/artifacts.json`)).default;
    } else {
      return (await import(`./generated/english/artifacts.json`)).default;
    }
  }

  async materials(): Promise<Material[]> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/materials.json`)).default;
    } else if (this.options.language === 'japanese') {
      return (await import(`./generated/japanese/materials.json`)).default;
    } else {
      return (await import(`./generated/english/materials.json`)).default;
    }
  }

  async tierlist(): Promise<Tierlist> {
    if (this.options.language === 'spanish') {
      return (await import(`./generated/spanish/tierlist.json`)).default;
    } else if (this.options.language === 'japanese') {
      return (await import(`./generated/japanese/tierlist.json`)).default;
    } else {
      return (await import(`./generated/english/tierlist.json`)).default;
    }
  }
}
