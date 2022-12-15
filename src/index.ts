import type { Artifact } from './types/artifact';
import type { Character } from './types/character';
import type { Food } from './types/food';
import type { Weapon } from './types/weapon';
import type { CommonMaterial } from './types/common_material';
import type { ElementalStoneMaterial } from './types/elemental_stone_material';
import type { Ingredients } from './types/ingredient';
import type { JewelMaterial } from './types/jewel_material';
import type { LocalMaterial } from './types/local_material';
import type { Potion } from './types/potion';
import type { TalentLvlUpMaterial } from './types/talent_lvl_up_material';
import type { WeaponPrimaryMaterial } from './types/weapon_primary_material';
import type { WeaponSecondaryMaterial } from './types/weapon_secondary_material';
import type { Bait, Fish, FishingRod } from './types/fishing';
import type { ExpMaterial } from './types/exp';
import type { AchievementCategory, Achievement } from './types/achievement';
import type { Furnishing } from './types/furnishing';
import type { Domains } from './types/domain';
import type { TCGCharacterCard } from './types/tcg_character';
import type { TCGActionCard } from './types/tcg_action';

export type Material =
  | CommonMaterial
  | ElementalStoneMaterial
  | JewelMaterial
  | LocalMaterial
  | Potion
  | TalentLvlUpMaterial
  | WeaponPrimaryMaterial
  | WeaponSecondaryMaterial;

export type TCGCard = TCGCharacterCard & TCGActionCard;

export type {
  AchievementCategory,
  Achievement,
  Artifact,
  Character,
  Weapon,
  CommonMaterial,
  Domains,
  ElementalStoneMaterial,
  ExpMaterial,
  Food,
  Ingredients,
  JewelMaterial,
  LocalMaterial,
  Potion,
  TalentLvlUpMaterial,
  WeaponPrimaryMaterial,
  WeaponSecondaryMaterial,
  Bait,
  Fish,
  FishingRod,
  Furnishing,
  TCGCharacterCard,
  TCGActionCard,
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
  | 'achievements'
  | 'artifacts'
  | 'bait'
  | 'character_exp_material'
  | 'characters'
  | 'common_materials'
  | 'domains'
  | 'elemental_stone_materials'
  | 'fish'
  | 'fishing_rod'
  | 'furnishing'
  | 'food'
  | 'ingredients'
  | 'jewels_materials'
  | 'local_materials'
  | 'potions'
  | 'talent_lvl_up_materials'
  | 'tcg_action'
  | 'tcg_characters'
  | 'weapon_enhancement_material'
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

  async fish(query?: QueryOpts<Fish>): Promise<Fish[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'fish', query);
  }

  async fishingRods(query?: QueryOpts<FishingRod>): Promise<FishingRod[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'fishing_rod', query);
  }

  async baits(query?: QueryOpts<Bait>): Promise<Bait[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'bait', query);
  }

  async characterExpMaterials(
    query?: QueryOpts<ExpMaterial>
  ): Promise<ExpMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'character_exp_material', query);
  }

  async weaponExpMaterials(
    query?: QueryOpts<ExpMaterial>
  ): Promise<ExpMaterial[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'weapon_enhancement_material', query);
  }

  async materials(query?: QueryOpts<Material>): Promise<Material[]> {
    const lang = this.getLang();
    const ret = await Promise.all([
      await this.findByFolder(lang, 'weapon_primary_materials', query),
      await this.findByFolder(lang, 'weapon_secondary_materials', query),
      await this.findByFolder(lang, 'common_materials', query),
      await this.findByFolder(lang, 'elemental_stone_materials', query),
      await this.findByFolder(lang, 'jewels_materials', query),
      await this.findByFolder(lang, 'local_materials', query),
      await this.findByFolder(lang, 'talent_lvl_up_materials', query),
      await this.findByFolder(lang, 'character_exp_material', query),
      await this.findByFolder(lang, 'weapon_enhancement_material', query),
    ]);

    return ret.flat();
  }

  async achievements(
    query?: QueryOpts<AchievementCategory>
  ): Promise<AchievementCategory[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'achievements', query);
  }

  async furnishings(query?: QueryOpts<Furnishing>): Promise<Furnishing[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'furnishing', query);
  }

  async domains(query?: QueryOpts<Domains>): Promise<Domains> {
    const lang = this.getLang();
    return (await this.findByFolder(lang, 'domains', query))[0];
  }

  async tcgCharacters(
    query?: QueryOpts<TCGCharacterCard>
  ): Promise<TCGCharacterCard[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'tcg_characters', query);
  }

  async tcgActions(query?: QueryOpts<TCGActionCard>): Promise<TCGActionCard[]> {
    const lang = this.getLang();
    return await this.findByFolder(lang, 'tcg_action', query);
  }

  async tcgCards(query?: QueryOpts<TCGCard>): Promise<TCGCard[]> {
    const lang = this.getLang();
    const ret = await Promise.all([
      await this.findByFolder(lang, 'tcg_characters', query),
      await this.findByFolder(lang, 'tcg_action', query),
    ]);

    return ret.flat();
  }

  private async findByFolder<T>(
    lang: Languages,
    folder: Folders,
    query?: QueryOpts<T>
  ): Promise<T[]> {
    let results = (await import(`./min/data_${lang}.min.json`)).default[folder];

    if (query) {
      results = this.selectProps(results, query);
    }

    return results;
  }

  private selectProps<T>(results: T[], query: QueryOpts<T>): T[] {
    if (query.select) {
      return results.map((result) => {
        let obj: Partial<T> = {};
        query.select?.forEach((key) => {
          obj[key] = result[key];
        });

        return obj as T;
      });
    }

    return results;
  }
}
