import { z } from 'zod';

/**
 * Runtime schemas mirroring the hand-checked shape of `src/data/<lang>/**`.
 *
 * These are intentionally LENIENT about content (free-form strings) but STRICT about
 * structure, because structure is what breaks silently: a stale mapping anchor in
 * format-genshindata yields a whole folder of empty names or missing ids, which no
 * TypeScript interface will ever catch since they are compile-time only and the data
 * is loaded from JSON at runtime.
 *
 * The key invariant enforced here is the one that actually broke: every entry must have a
 * non-empty `id` and a resolvable `name`. Slugs are the join key across languages and across
 * the whole dataset (domains rotations reference character/weapon ids), so an empty or
 * colliding `id` silently corrupts cross-references instead of failing loudly.
 */

/**
 * A slug id: non-empty, lowercase, `[a-z0-9_]` only, no doubled underscores.
 *
 * A trailing underscore IS legal and does occur in published data — `slugify()` maps
 * spaces to `_` before stripping non-word chars, so a name ending in a stripped
 * character (e.g. "Lane Shrub Standard (L)") yields `lane_shrub_standard_`. The
 * filename always mirrors the id, so these round-trip correctly; do not "fix" them.
 *
 * The invariant that actually matters is non-emptiness: an empty id means the name
 * hash did not resolve, which silently drops the entity from every index.
 */
export const slug = z
  .string()
  .min(1, 'id must not be empty (slugify(undefined) -> "")')
  .max(200)
  .regex(/^[a-z0-9]+(?:_[a-z0-9]*)*$/, 'id must be a lowercase slug (letters, digits, underscores)')
  .refine((s) => /[a-z0-9]/.test(s), 'id must contain at least one alphanumeric character');

const nonEmptyStr = z.string().min(1, 'must not be empty');

/** Numeric dump id. Kept as a positive int: 0/absent means "not resolved". */
const numId = z.number().int().positive();

/** Root/category nodes legitimately carry `_id: 0` (e.g. achievements "Wonders of the World"). */
const anyNumId = z.number().int();

const named = {
  _id: numId,
  id: slug,
  name: nonEmptyStr,
};

/** Anything the dump may leave unresolved: weekly-boss drops, enemy mats, 7.x gaps. */
const optStr = z.string().optional();

/**
 * A few generic placeholders ("Ceiling 1", "Wall 1", "Test Grill") have no IT/TR
 * localization, so their `name` resolves empty. The file still exists and the id
 * (slugified from EN) is valid, so treat an empty name as advisory, not a hard failure.
 */
const maybeNamed = { _id: numId, id: slug, name: optStr };

const mat = z.object({
  _id: numId,
  id: slug,
  name: nonEmptyStr,
  amount: z.number(),
  rarity: z.number().optional(),
});

/**
 * Day names are LOCALIZED per language, so this cannot be a fixed enum — `days` holds
 * "Monday" in english and "周一" in chinese-simplified. Validate shape only; the
 * meaningful invariant is that the array is non-empty when a domain is present.
 */
const day = z.string().min(1);

const EN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- characters -------------------------------------------------------------

const element = z.object({
  id: z.string(),
  name: optStr,
});

const character = z.object({
  ...named,
  title: optStr,
  description: optStr,
  weapon_type: element,
  element: element,
  gender: element,
  release: z.number(),
  substat: optStr,
  affiliation: optStr,
  region: element,
  rarity: z.number(),
  // Traveler variants and the practice dummies have an unresolved birthday -> [null, null].
  birthday: z.array(z.number().nullable()),
  constellation: optStr,
  domain: optStr,
  cv: z
    .object({
      english: optStr,
      chinese: optStr,
      japanese: optStr,
      korean: optStr,
    })
    .partial(),
  // Skill `id` comes from the EN name slug. A handful of non-EN languages are missing the
  // EN textmap hash for a skill, which yields `id: ""` (known 7.x textmap gap — 3 skills in
  // chinese-simplified). Keep it optional here and report it via the validator's slug check.
  skills: z.array(
    z.object({
      _id: numId,
      id: slug.or(z.literal('')),
      name: nonEmptyStr,
      description: optStr,
      info: optStr,
      attributes: z.array(z.object({ label: optStr, values: z.array(z.string()) })),
    })
  ),
  passives: z.array(z.object({ _id: numId.optional(), id: slug, name: optStr, description: optStr, level: z.number() })),
  constellations: z.array(z.object({ _id: numId.optional(), id: slug, name: optStr, description: optStr, level: z.number() })),
  ascension: z.array(
    z.object({
      level: z.array(z.number()),
      stats: z.array(z.object({ label: z.string(), values: z.array(z.union([z.number(), z.string()])) })),
      cost: z.number().optional(),
      mat1: mat.optional(),
      mat2: mat.optional(),
      mat3: mat.optional(),
      mat4: mat.optional(),
    })
  ),
  talent_materials: z.array(z.object({ level: z.number(), cost: z.number(), items: z.array(mat) })),
  outfits: z.array(z.object({ id: z.number(), name: optStr, description: optStr, isDefault: z.boolean(), characterName: optStr, characterId: numId })),
  // Added by format-genshindata 7.x; absent on older dumps.
  voices: z.array(z.object({ id: z.string(), type: z.number(), title: optStr, text: optStr })).optional(),
});

// --- weapons ----------------------------------------------------------------

const weapon = z.object({
  ...named,
  description: optStr,
  rarity: z.number(),
  type: z.object({ id: z.string(), name: optStr }),
  domain: optStr,
  passive: optStr,
  bonus: optStr,
  specialProp: optStr,
  stats: z.object({
    primary: nonEmptyStr,
    secondary: optStr,
    levels: z.array(z.object({ ascension: z.number(), level: z.number(), primary: z.number(), secondary: z.number().optional() })),
  }),
  ascensions: z.array(
    z.object({
      ascension: z.number(),
      level: z.number(),
      cost: z.number().optional(),
      // Empty when the dump ships costItems without ids (7.x weaponPromoteId 11521).
      materials: z.array(mat),
    })
  ),
  refinement_raw: z.object({ name: optStr, template: optStr, params: z.array(z.array(z.string())) }),
  refinements: z.array(z.object({ refinement: z.number(), desc: optStr })),
});

// --- TCG --------------------------------------------------------------------

/**
 * TCG character skills carry `id`/`skillTag`/`points`; TCG ACTION skills carry only
 * `name`/`desc` (and the name is often legitimately empty — generic "Combat Action"
 * entries). Do not tighten these into one shape.
 */
const tcgSkill = z.object({
  id: slug.optional(),
  name: optStr,
  desc: optStr,
  skillTag: z.array(z.string()).optional(),
  points: z.array(z.object({ _id: numId, id: slug, type: z.string(), count: z.number() })).optional(),
});

const tcgCommon = {
  ...named,
  // A handful of TCG rows have no shareId (unshareable/test cards).
  shareId: z.number().optional(),
  desc: optStr,
  skills: z.array(tcgSkill),
};

/** TCG character card attributes (shared by tcg_characters and character-like tcg_monsters). */
const tcgCardAttributes = z.object({
  hp: z.number(),
  card_type: optStr,
  // Normally a number; a few 7.x cards (Mavuika, Skirk) emit a list or omit it entirely.
  energy: z.union([z.number(), z.array(z.any())]).optional(),
  element: optStr,
  weapon: optStr,
  faction: z.array(z.string()).optional(),
  talent_card: z.object({ _id: numId, id: slug, name: nonEmptyStr }).optional(),
  source: optStr,
  character: z.object({ id: slug, name: nonEmptyStr, _id: numId.optional() }).optional(),
});

/**
 * TCG action card attributes: `energy` is a LIST of cost entries, not a number, and
 * there is no `hp`/`element`/`weapon`/`faction`.
 */
const tcgActionAttributes = z.object({
  cost: z.number().optional(),
  cost_type: optStr,
  card_type: optStr,
  energy: z.array(z.object({ _id: numId, id: slug, type: z.string(), count: z.number() })),
  source: optStr,
  tags: z.array(z.string()).optional(),
});

const tcgCharacter = z.object({ ...tcgCommon, title: optStr, attributes: tcgCardAttributes });

const tcgMonster = z.object({
  ...tcgCommon,
  title: optStr,
  // tcg_monsters is a mixed bag: monster cards use character-like attributes, and some
  // rows are action-shaped. Accept either rather than pinning a single shape.
  attributes: z.union([tcgCardAttributes, tcgActionAttributes]),
});

// --- monsters / domains -----------------------------------------------------

const monster = z.object({
  ...named,
  monsterId: numId,
  specialNames: z.array(z.string().nullable()),
  rewardPreview: z.array(z.object({ _id: numId, id: slug, name: nonEmptyStr, count: z.union([z.number(), z.string()]).optional(), rarity: z.number().optional() })),
  monsterType: optStr,
  enemyType: optStr,
  categoryType: optStr,
  categoryText: optStr,
  filename_icon: optStr,
  description: optStr,
  aggroRange: optStr,
  // Unranked/ambient monsters carry no bgm, and some (samachurl) no budget or defense stat.
  bgm: z.number().optional(),
  budget: z.number().optional(),
  stats: z.object({
    resistance: z.record(z.string(), z.number()),
    base: z.object({ hp: z.number().optional(), attack: z.number().optional(), defense: z.number().optional() }),
    curve: z.object({ hp: z.string().optional(), attack: z.string().optional(), defense: z.string().optional() }).partial(),
  }),
});

const domain = z.object({
  ...named,
  entranceId: z.number(),
  entranceName: optStr,
  description: optStr,
  regionId: z.number(),
  regionName: optStr,
  recommendedLevel: z.number(),
  unlockRank: z.number(),
  disorder: z.array(z.string()),
  filename_image: optStr,
  recommendedElements: z.array(z.string()),
  domainType: optStr,
  domainText: optStr,
  rewardPreview: z.array(z.object({ _id: numId, id: slug, name: nonEmptyStr })),
  monsterList: z.array(z.object({ _id: numId, id: slug, name: nonEmptyStr })),
});

// --- materials --------------------------------------------------------------

const talentMaterial = z.object({
  ...named,
  description: optStr,
  source: z.array(z.string()),
  rarity: z.number(),
  location: optStr,
  craft: z.object({ cost: z.number(), items: z.array(z.object({ _id: numId, id: slug, name: optStr, amount: z.number() })), result: z.number() }).optional(),
  domain: optStr,
  domainId: optStr,
  days: z.array(day).optional(),
});

/**
 * A domain-drop material MUST carry `days`; the frontend rotation cannot be computed
 * without them. format-genshindata throws when this is missing, so a violation here
 * means the data was hand-edited after generation.
 */
const talentMaterialStrict = talentMaterial.refine(
  (m) => (m.domain ? m.days && m.days.length > 0 : true),
  { message: 'domain material must have non-empty days' }
);

const weaponPrimaryMaterial = talentMaterialStrict;

// --- generic/simple entities ------------------------------------------------

// `rarity` is absent on gatherable local materials (and on some other unranked items).
const material = z.object({
  ...named,
  description: optStr,
  rarity: z.number().optional(),
  source: z.union([z.string(), z.array(z.string())]).optional(),
  location: optStr,
  domain: optStr,
  domainId: optStr,
  days: z.array(day).optional(),
  craft: z.any().optional(),
  type: z.string().optional(),
  results: z.array(z.any()).optional(),
  ingredients: z.array(z.any()).optional(),
  load: z.number().optional(),
  energy: z.number().optional(),
  exp: z.number().optional(),
  category: z.array(z.object({ id: z.number(), category: optStr, type: optStr })).optional(),
  recipe: z.array(mat).optional(),
});

/** Individually nameable artifact pieces (Goblet, Plume, Circlet, Flower, Sands). */
const artifactPiece = z.object({
  _id: numId,
  id: slug,
  name: nonEmptyStr,
  description: optStr,
  rarity: z.number().optional(),
  icon: optStr,
});

// Artifacts carry `min_rarity`/`max_rarity` (not `rarity`), 2pc/4pc effect text, and
// named pieces only for sets that have individually-described artifacts.
const artifact = z.object({
  ...named,
  min_rarity: z.number(),
  max_rarity: z.number(),
  // 1pc artifacts (e.g. the 7.x "Prayers" series) expose `one_pc` instead of 2pc/4pc.
  one_pc: z.string().optional(),
  two_pc: z.string().optional(),
  four_pc: z.string().optional(),
  goblet: artifactPiece.optional(),
  plume: artifactPiece.optional(),
  circlet: artifactPiece.optional(),
  flower: artifactPiece.optional(),
  sands: artifactPiece.optional(),
});

const fish = z.object({
  ...named,
  description: optStr,
  rarity: z.number().optional(),
  source: z.union([z.string(), z.array(z.string())]).optional(),
  bait: z.object({ _id: numId, id: slug, name: optStr, rarity: z.number().optional() }).nullable().optional(),
});
const fishingRod = z.object({ ...named, description: optStr, rarity: z.number().optional(), type: optStr });
const bait = z.object({ ...named, description: optStr, rarity: z.number().optional() });
const potion = z.object({ ...named, description: optStr, rarity: z.number().optional() });
// Ingredients have no `rarity` in the dump (they are not rank-gated items).
const ingredient = z.object({ ...named, description: optStr, rarity: z.number().optional() });
const food = z.object({ ...named, description: optStr, rarity: z.number() });
const furnishing = z.object({
  ...maybeNamed,
  rarity: z.number(),
  description: optStr,
  load: z.number().optional(),
  energy: z.number().optional(),
  exp: z.number().optional(),
  category: z.array(z.object({ id: z.number(), category: optStr, type: optStr })).optional(),
  recipe: z.array(mat).optional(),
});
const characterExpMaterial = material;
const weaponEnhancementMaterial = material;
const geography = z.object({ ...named, description: optStr, area: optStr, areaId: z.number().optional() });
const weaponSkin = z.object({ ...named, name: optStr, description: optStr, weapon: optStr, character: optStr, rarity: z.number().optional() });
/** Leaf achievement: numeric id (not a slug) plus desc/reward/hidden flags. */
const achievementLeaf = z.object({
  id: z.number().int(),
  name: optStr,
  desc: optStr,
  reward: z.number().optional(),
  hidden: z.boolean().optional(),
  order: z.number().optional(),
  finished: z.boolean().optional(),
  progress: z.number().optional(),
});

/** Root achievement group: slug id, optional order, nested leaves. `_id: 0` on the single root. */
const achievement = z.object({
  _id: anyNumId,
  id: slug,
  name: optStr,
  order: z.number().optional(),
  achievements: z.array(achievementLeaf).optional(),
});
const jewelMaterial = material;
const localMaterial = material;
const commonMaterial = material;
const elementalStoneMaterial = material;
const weaponSecondaryMaterial = material;

// `domains.json` — the rotation index. Its `ids` MUST reference ids that exist.
const domainsJson = z.object({
  characters: z.array(
    z.object({ domainName: nonEmptyStr, rotation: z.array(z.object({ day, ids: z.array(slug) })) })
  ),
  weapons: z.array(
    z.object({ domainName: nonEmptyStr, rotation: z.array(z.object({ day, ids: z.array(slug) })) })
  ),
});

/** folder name -> schema for a single entry. */
export const FOLDER_SCHEMAS = {
  achievements: achievement,
  artifacts: artifact,
  bait: bait,
  character_exp_material: characterExpMaterial,
  characters: character,
  common_materials: commonMaterial,
  domains: domain,
  elemental_stone_materials: elementalStoneMaterial,
  fish: fish,
  fishing_rod: fishingRod,
  furnishing: furnishing,
  food: food,
  geography: geography,
  ingredients: ingredient,
  jewels_materials: jewelMaterial,
  local_materials: localMaterial,
  monsters: monster,
  potions: potion,
  talent_lvl_up_materials: talentMaterialStrict,
  tcg_action: z.object({ ...tcgCommon, title: optStr, in_play_description: optStr, attributes: tcgActionAttributes }),
  tcg_characters: tcgCharacter,
  tcg_monsters: tcgMonster,
  weapon_enhancement_material: weaponEnhancementMaterial,
  weapon_primary_materials: weaponPrimaryMaterial,
  weapon_secondary_materials: weaponSecondaryMaterial,
  weapon_skins: weaponSkin,
  weapons: weapon,
};

export const schemas = {
  ...FOLDER_SCHEMAS,
  domainsRoot: domainsJson,
};

export { EN_DAYS };
