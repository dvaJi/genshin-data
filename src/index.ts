import type { Artifact } from './types/artifact';
import type { Character } from './types/character';
import type { Food } from './types/food';
import type { Weapon } from './types/weapon';
import type { CommonMaterial } from './types/common_material';
import type { ElementalStoneMaterial } from './types/elemental_stone_material';
import type { Ingredient } from './types/ingredient';
import type { JewelMaterial } from './types/jewel_material';
import type { LocalMaterial } from './types/local_material';
import type { Potion } from './types/potion';
import type { CharacterExpMaterial } from './types/character_exp_material';
import type { TalentLvlUpMaterial } from './types/talent_lvl_up_material';
import type { WeaponPrimaryMaterial } from './types/weapon_primary_material';
import type { WeaponSecondaryMaterial } from './types/weapon_secondary_material';
import type { AchievementElement, Achievement } from './types/achievement';
import type { Furnishing } from './types/furnishing';
import type { Fish, Bait } from './types/fish';
import type { FishingRod } from './types/fishing_rod';
import type { DomainsJSON } from './types/domains';
import type { TcgCharacter } from './types/tcg_character';
import type { TcgAction } from './types/tcg_action';
import type { TcgMonster } from './types/tcg_monster';
import type { Monster } from './types/monster';
import type { Geography } from './types/geography';
import type { Domain } from './types/domain';
import { WeaponEnhancementMaterial } from './types/weapon_enhancement_material';
import { languages, type Languages } from './types/language';
import type { Folders } from './types/folders';
import type { Options, QueryOpts } from './types/options';
import { findByFolder } from './utils';

export type Material =
  | CommonMaterial
  | ElementalStoneMaterial
  | JewelMaterial
  | LocalMaterial
  | Potion
  | TalentLvlUpMaterial
  | WeaponPrimaryMaterial
  | WeaponSecondaryMaterial;

export type TCGCard = TcgCharacter & TcgAction & TcgMonster;

export type {
  AchievementElement,
  Achievement,
  Artifact,
  Character,
  Weapon,
  CommonMaterial,
  DomainsJSON,
  Domain,
  ElementalStoneMaterial,
  CharacterExpMaterial,
  Food,
  Ingredient,
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
  TcgCharacter,
  TcgAction,
  TcgMonster,
  Languages,
  Options,
  QueryOpts,
  Folders,
};

export { languages };

/**
 * The main class for interacting with the Genshin Impact data.
 */
export default class GenshinData {
  options: Options = {
    language: 'english',
  };

  /**
   * Creates a new instance of the GenshinData class.
   * @param opts The options to use.
   */
  constructor(opts?: Options) {
    if (opts) {
      this.options = { ...this.options, ...opts };
    }
  }

  /**
   * Sets the options for the class.
   * @param opts The options to use.
   */
  setOptions(opts: Options) {
    this.options = { ...this.options, ...opts };
  }

  /**
   * Gets the current options.
   * @returns The current options.
   */
  getOptions(): Options {
    return this.options;
  }

  /**
   * Gets the current language.
   * @returns The current language.
   */
  getLang(): Languages {
    return this.options.language;
  }

  private async findByFolder<T>(
    folder: Folders,
    query?: QueryOpts<T>
  ): Promise<T[]> {
    return findByFolder(this.getLang(), folder, query);
  }

  /**
   * Gets a list of characters.
   * @param query The query options.
   * @returns A list of characters.
   */
  async characters(query?: QueryOpts<Character>): Promise<Character[]> {
    return this.findByFolder('characters', query);
  }

  /**
   * Gets a list of weapons.
   * @param query The query options.
   * @returns A list of weapons.
   */
  async weapons(query?: QueryOpts<Weapon>): Promise<Weapon[]> {
    return this.findByFolder('weapons', query);
  }

  /**
   * Gets a list of artifacts.
   * @param query The query options.
   * @returns A list of artifacts.
   */
  async artifacts(query?: QueryOpts<Artifact>): Promise<Artifact[]> {
    return this.findByFolder('artifacts', query);
  }

  /**
   * Gets a list of common materials.
   * @param query The query options.
   * @returns A list of common materials.
   */
  async commonMaterials(
    query?: QueryOpts<CommonMaterial>
  ): Promise<CommonMaterial[]> {
    return this.findByFolder('common_materials', query);
  }

  /**
   * Gets a list of elemental stone materials.
   * @param query The query options.
   * @returns A list of elemental stone materials.
   */
  async elementalStoneMaterials(
    query?: QueryOpts<ElementalStoneMaterial>
  ): Promise<ElementalStoneMaterial[]> {
    return this.findByFolder('elemental_stone_materials', query);
  }

  /**
   * Gets a list of food.
   * @param query The query options.
   * @returns A list of food.
   */
  async food(query?: QueryOpts<Food>): Promise<Food[]> {
    return this.findByFolder('food', query);
  }

  /**
   * Gets a list of ingredients.
   * @param query The query options.
   * @returns A list of ingredients.
   */
  async ingredients(query?: QueryOpts<Ingredient>): Promise<Ingredient[]> {
    return this.findByFolder('ingredients', query);
  }

  /**
   * Gets a list of jewel materials.
   * @param query The query options.
   * @returns A list of jewel materials.
   */
  async jewelsMaterials(
    query?: QueryOpts<JewelMaterial>
  ): Promise<JewelMaterial[]> {
    return this.findByFolder('jewels_materials', query);
  }

  /**
   * Gets a list of local materials.
   * @param query The query options.
   * @returns A list of local materials.
   */
  async localMaterials(
    query?: QueryOpts<LocalMaterial>
  ): Promise<LocalMaterial[]> {
    return this.findByFolder('local_materials', query);
  }

  /**
   * Gets a list of potions.
   * @param query The query options.
   * @returns A list of potions.
   */
  async potions(query?: QueryOpts<Potion>): Promise<Potion[]> {
    return this.findByFolder('potions', query);
  }

  /**
   * Gets a list of talent level-up materials.
   * @param query The query options.
   * @returns A list of talent level-up materials.
   */
  async talentLvlUpMaterials(
    query?: QueryOpts<TalentLvlUpMaterial>
  ): Promise<TalentLvlUpMaterial[]> {
    return this.findByFolder('talent_lvl_up_materials', query);
  }

  /**
   * Gets a list of weapon primary materials.
   * @param query The query options.
   * @returns A list of weapon primary materials.
   */
  async weaponPrimaryMaterials(
    query?: QueryOpts<WeaponPrimaryMaterial>
  ): Promise<WeaponPrimaryMaterial[]> {
    return this.findByFolder('weapon_primary_materials', query);
  }

  /**
   * Gets a list of weapon secondary materials.
   * @param query The query options.
   * @returns A list of weapon secondary materials.
   */
  async weaponSecondaryMaterials(
    query?: QueryOpts<WeaponSecondaryMaterial>
  ): Promise<WeaponSecondaryMaterial[]> {
    return this.findByFolder('weapon_secondary_materials', query);
  }

  /**
   * Gets a list of fish.
   * @param query The query options.
   * @returns A list of fish.
   */
  async fish(query?: QueryOpts<Fish>): Promise<Fish[]> {
    return this.findByFolder('fish', query);
  }

  /**
   * Gets a list of fishing rods.
   * @param query The query options.
   * @returns A list of fishing rods.
   */
  async fishingRods(query?: QueryOpts<FishingRod>): Promise<FishingRod[]> {
    return this.findByFolder('fishing_rod', query);
  }

  /**
   * Gets a list of baits.
   * @param query The query options.
   * @returns A list of baits.
   */
  async baits(query?: QueryOpts<Bait>): Promise<Bait[]> {
    return this.findByFolder('bait', query);
  }

  /**
   * Gets a list of character experience materials.
   * @param query The query options.
   * @returns A list of character experience materials.
   */
  async characterExpMaterials(
    query?: QueryOpts<CharacterExpMaterial>
  ): Promise<CharacterExpMaterial[]> {
    return this.findByFolder('character_exp_material', query);
  }

  /**
   * Gets a list of weapon experience materials.
   * @param query The query options.
   * @returns A list of weapon experience materials.
   */
  async weaponExpMaterials(
    query?: QueryOpts<WeaponEnhancementMaterial>
  ): Promise<WeaponEnhancementMaterial[]> {
    return this.findByFolder('weapon_enhancement_material', query);
  }

  /**
   * Gets a list of all materials.
   * @param query The query options.
   * @returns A list of all materials.
   */
  async materials(query?: QueryOpts<Material>): Promise<Material[]> {
    const ret = await Promise.all([
      this.findByFolder('weapon_primary_materials', query),
      this.findByFolder('weapon_secondary_materials', query),
      this.findByFolder('common_materials', query),
      this.findByFolder('elemental_stone_materials', query),
      this.findByFolder('jewels_materials', query),
      this.findByFolder('local_materials', query),
      this.findByFolder('talent_lvl_up_materials', query),
      this.findByFolder('character_exp_material', query),
      this.findByFolder('weapon_enhancement_material', query),
    ]);

    return ret.flat();
  }

  /**
   * Gets a list of achievements.
   * @param query The query options.
   * @returns A list of achievements.
   */
  async achievements(
    query?: QueryOpts<AchievementElement>
  ): Promise<AchievementElement[]> {
    return this.findByFolder('achievements', query);
  }

  /**
   * Gets a list of furnishings.
   * @param query The query options.
   * @returns A list of furnishings.
   */
  async furnishings(query?: QueryOpts<Furnishing>): Promise<Furnishing[]> {
    return this.findByFolder('furnishing', query);
  }

  /**
   * Gets a list of domains.
   * @param query The query options.
   * @returns A list of domains.
   */
  async domains(query?: QueryOpts<DomainsJSON>): Promise<DomainsJSON> {
    return (await this.findByFolder('domains', query))[0];
  }

  /**
   * Gets a list of TCG characters.
   * @param query The query options.
   * @returns A list of TCG characters.
   */
  async tcgCharacters(
    query?: QueryOpts<TcgCharacter>
  ): Promise<TcgCharacter[]> {
    return this.findByFolder('tcg_characters', query);
  }

  /**
   * Gets a list of TCG actions.
   * @param query The query options.
   * @returns A list of TCG actions.
   */
  async tcgActions(query?: QueryOpts<TcgAction>): Promise<TcgAction[]> {
    return this.findByFolder('tcg_action', query);
  }

  /**
   * Gets a list of TCG monsters.
   * @param query The query options.
   * @returns A list of TCG monsters.
   */
  async tcgMonsters(query?: QueryOpts<TcgMonster>): Promise<TcgMonster[]> {
    return this.findByFolder('tcg_monsters', query);
  }

  /**
   * Gets a list of all TCG cards.
   * @param query The query options.
   * @returns A list of all TCG cards.
   */
  async tcgCards(query?: QueryOpts<TCGCard>): Promise<TCGCard[]> {
    const ret = await Promise.all([
      this.findByFolder('tcg_characters', query),
      this.findByFolder('tcg_action', query),
      this.findByFolder('tcg_monsters', query),
    ]);

    return ret.flat();
  }

  /**
   * Gets a list of monsters.
   * @param query The query options.
   * @returns A list of monsters.
   */
  async monsters(query?: QueryOpts<Monster>): Promise<Monster[]> {
    return this.findByFolder('monsters', query);
  }

  /**
   * Gets a list of geography.
   * @param query The query options.
   * @returns A list of geography.
   */
  async geography(query?: QueryOpts<Geography>): Promise<Geography[]> {
    return this.findByFolder('geography', query);
  }

  /**
   * Gets a list of domains.
   * @param query The query options.
   * @returns A list of domains.
   */
  async domainsList(query?: QueryOpts<Domain>): Promise<Domain[]> {
    return this.findByFolder('domains', query);
  }
}
