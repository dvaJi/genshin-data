import { Artifact } from './types/artifact';
import { Character } from './types/character';
import { Material } from './types/material';
import { Weapon } from './types/weapon';

export { Artifact, Character, Weapon, Material };

type Languages = 'english' | 'spanish' | 'japanese';

export interface Options {
  language: Languages;
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

  getLang(): Languages {
    return this.options.language;
  }

  async characters(query?: QueryOpts<Character>): Promise<Character[]> {
    const lang = this.getLang();
    let results = (await import(`./generated/${lang}/characters.json`)).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async weapons(query?: QueryOpts<Weapon>): Promise<Weapon[]> {
    const lang = this.getLang();
    let results = (await import(`./generated/${lang}/weapons.json`)).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async artifacts(query?: QueryOpts<Artifact>): Promise<Artifact[]> {
    const lang = this.getLang();
    let results = (await import(`./generated/${lang}/artifacts.json`)).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  async materials(query?: QueryOpts<Material>): Promise<Material[]> {
    const lang = this.getLang();
    let results = (await import(`./generated/${lang}/materials.json`)).default;

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
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
