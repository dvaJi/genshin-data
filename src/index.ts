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
    let results = (
      await import(`./generated/${this.options.language}/characters.json`)
    ).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async weapons(query?: QueryOpts<Weapon>): Promise<Weapon[]> {
    let results = (
      await import(`./generated/${this.options.language}/weapons.json`)
    ).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async artifacts(query?: QueryOpts<Artifact>): Promise<Artifact[]> {
    let results = (
      await import(`./generated/${this.options.language}/artifacts.json`)
    ).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async materials(query?: QueryOpts<Material>): Promise<Material[]> {
    let results = (
      await import(`./generated/${this.options.language}/materials.json`)
    ).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async tierlist(): Promise<Tierlist> {
    return (await import(`./generated/${this.options.language}/tierlist.json`))
      .default;
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
