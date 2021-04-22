import { Artifact } from './types/artifact';
import { Character } from './types/character';
import { Food } from './types/food';
import { Weapon } from './types/weapon';
import { CommonMaterial } from './types/common_material';
import { ElementalStoneMaterial } from './types/elemental_stone_material';
import { Ingredients } from './types/ingredient';
import { JewelMaterial } from './types/jewel_material';
import { LocalMaterial } from './types/local_material';
import { Potion } from './types/potion';
import { TalentLvlUpMaterial } from './types/talent_lvl_up_material';
import { WeaponPrimaryMaterial } from './types/weapon_primary_material';
import { WeaponSecondaryMaterial } from './types/weapon_secondary_material';

export {
  Artifact,
  Character,
  Weapon,
  CommonMaterial,
  ElementalStoneMaterial,
  Food,
  Ingredients,
  JewelMaterial,
  LocalMaterial,
  Potion,
  TalentLvlUpMaterial,
  WeaponPrimaryMaterial,
  WeaponSecondaryMaterial,
};

export const languages = [
  'english',
  'spanish',
  'japanese',
  'chinese-simplified',
  'chinese-traditional',
  'french',
  'german',
  'indonesian',
  'korean',
  'portuguese',
  'russian',
  'thai',
  'vietnamese',
] as const;

export type Languages = typeof languages[number];

type Folders =
  | 'artifacts'
  | 'characters'
  | 'common_materials'
  | 'elemental_stone_materials'
  | 'food'
  | 'ingredients'
  | 'jewels_materials'
  | 'local_materials'
  | 'potions'
  | 'talent_lvl_up_materials'
  | 'weapon_primary_materials'
  | 'weapon_secondary_materials'
  | 'weapons';

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
    return await this.findByFolder(lang, 'characters', query);
  }

  async weapons(query?: QueryOpts<Weapon>): Promise<Weapon[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'weapons', query);
  }

  async artifacts(query?: QueryOpts<Artifact>): Promise<Artifact[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'artifacts', query);
  }

  async commonMaterials(
    query?: QueryOpts<CommonMaterial>
  ): Promise<CommonMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'common_materials', query);
  }

  async elementalStoneMaterials(
    query?: QueryOpts<ElementalStoneMaterial>
  ): Promise<ElementalStoneMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'elemental_stone_materials', query);
  }

  async food(query?: QueryOpts<Food>): Promise<Food[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'food', query);
  }

  async ingredients(query?: QueryOpts<Ingredients>): Promise<Ingredients[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'ingredients', query);
  }

  async jewelsMaterials(
    query?: QueryOpts<JewelMaterial>
  ): Promise<JewelMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'jewels_materials', query);
  }

  async localMaterials(
    query?: QueryOpts<LocalMaterial>
  ): Promise<LocalMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'local_materials', query);
  }

  async potions(query?: QueryOpts<Potion>): Promise<Potion[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'potions', query);
  }

  async talentLvlUpMaterials(
    query?: QueryOpts<TalentLvlUpMaterial>
  ): Promise<TalentLvlUpMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'talent_lvl_up_materials', query);
  }

  async weaponPrimaryMaterials(
    query?: QueryOpts<WeaponPrimaryMaterial>
  ): Promise<WeaponPrimaryMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'weapon_primary_materials', query);
  }

  async weaponSecondaryMaterials(
    query?: QueryOpts<WeaponSecondaryMaterial>
  ): Promise<WeaponSecondaryMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'weapon_secondary_materials', query);
  }

  private async findByFolder<T>(
    lang: string,
    folder: Folders,
    query?: QueryOpts<T>
  ) {
    let results = (await import(`./min/data_${lang}.min.json`)).default[folder];

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  private selectProps<T>(results: T[], query: QueryOpts<T>): T[] {
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
