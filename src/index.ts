import { Artifact } from './types/artifact';
import { Character } from './types/character';
import { Material } from './types/material';
import { Tierlist } from './types/tierlist';
import { Weapon } from './types/weapon';

export { Artifact, Character, Weapon, Material, Tierlist };

export interface Options {
  language: 'english' | 'spanish' | 'japanese';
}

export interface QueryOpts<T> {
  select?: (keyof T)[];
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

  async characters(query?: QueryOpts<Character>): Promise<Character[]> {
    let results = [];
    if (this.options.language === 'spanish') {
      results = (await import(`./generated/spanish/characters.json`)).default;
    } else if (this.options.language === 'japanese') {
      results = (await import(`./generated/japanese/characters.json`)).default;
    } else {
      results = (await import(`./generated/english/characters.json`)).default;
    }

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async weapons(query?: QueryOpts<Weapon>): Promise<Weapon[]> {
    let results = [];
    if (this.options.language === 'spanish') {
      results = (await import(`./generated/spanish/weapons.json`)).default;
    } else if (this.options.language === 'japanese') {
      results = (await import(`./generated/japanese/weapons.json`)).default;
    } else {
      results = (await import(`./generated/english/weapons.json`)).default;
    }

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async artifacts(query?: QueryOpts<Artifact>): Promise<Artifact[]> {
    let results = [];
    if (this.options.language === 'spanish') {
      results = (await import(`./generated/spanish/artifacts.json`)).default;
    } else if (this.options.language === 'japanese') {
      results = (await import(`./generated/japanese/artifacts.json`)).default;
    } else {
      results = (await import(`./generated/english/artifacts.json`)).default;
    }

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async materials(query?: QueryOpts<Material>): Promise<Material[]> {
    let results = [];
    if (this.options.language === 'spanish') {
      results = (await import(`./generated/spanish/materials.json`)).default;
    } else if (this.options.language === 'japanese') {
      results = (await import(`./generated/japanese/materials.json`)).default;
    } else {
      results = (await import(`./generated/english/materials.json`)).default;
    }

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
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

  selectProps<T>(results: T[], query: QueryOpts<T>): T[] {
    if (query.select) {
      return results.map(result => {
        let obj: Partial<T> = {};
        query.select?.forEach(key => {
          obj[key] = result[key];
        });

        return obj as T;
      });
    }

    return results;
  }
}
