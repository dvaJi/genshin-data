import { describe, expect, test } from 'vitest';
import fs from 'fs';
import { schemas, slug, EN_DAYS } from '../scripts/schemas.mjs';

/**
 * Meta-tests for the validator itself.
 *
 * These matter because `validate-data.mjs` is only as trustworthy as its schemas: a schema
 * that silently accepts anything (e.g. `z.any()`) turns the whole check into a no-op that
 * passes forever, and a schema that is too strict buries real regressions in noise.
 */
describe('schemas', () => {
  test('every src/data folder has a registered schema', () => {
    const folders = fs
      .readdirSync('src/data/english', { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    const missing = folders.filter((f) => !schemas[f]);
    expect(missing).toEqual([]);
  });

  test('slug rejects empty ids but allows trailing underscores', () => {
    // Empty id is THE bug this validator exists to catch (slugify(undefined) -> '').
    expect(slug.safeParse('').success).toBe(false);
    expect(slug.safeParse('  ').success).toBe(false);
    expect(slug.safeParse('___').success).toBe(false);
    expect(slug.safeParse('Consomme').success).toBe(false);
    // Real ids from the dataset.
    expect(slug.safeParse('amber').success).toBe(true);
    expect(slug.safeParse('the_frost_emperors_lament').success).toBe(true);
    expect(slug.safeParse('lane_shrub_standard_').success).toBe(true);
  });

  test('character schema requires resolvable id and name', () => {
    const s = schemas.characters;
    const base = {
      _id: 10000002,
      id: 'traveler_anemo',
      name: 'Traveler',
      weapon_type: { id: 'sword' },
      element: { id: 'anemo' },
      gender: { id: 'male' },
      release: 1,
      substat: '',
      affiliation: '',
      region: { id: 'mondstadt' },
      rarity: 5,
      birthday: [6, 9],
      constellation: '',
      domain: '',
      cv: { english: 'A', chinese: 'B', japanese: 'C', korean: 'D' },
      skills: [],
      passives: [],
      constellations: [],
      ascension: [],
      talent_materials: [],
      outfits: [],
    };
    expect(s.safeParse(base).success).toBe(true);
    // An empty name hash is the 7.x failure mode -> must be rejected.
    expect(s.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(s.safeParse({ ...base, id: '' }).success).toBe(false);
  });

  test('talent material with a domain must have days', () => {
    const s = schemas.talent_lvl_up_materials;
    const mat = {
      _id: 104323,
      id: 'guide_to_health',
      name: 'Guide to Health',
      description: 'x',
      source: ['x'],
      rarity: 3,
    };
    // No domain -> no days required.
    expect(s.safeParse(mat).success).toBe(true);
    // Domain but no days -> must fail (frontend cannot compute the rotation).
    expect(s.safeParse({ ...mat, domain: 'Domain of Mastery: Blessing' }).success).toBe(false);
    // Domain + days -> ok. Empty days array must still fail (it is not "has days").
    expect(s.safeParse({ ...mat, domain: 'Domain of Mastery: Blessing', days: [] }).success).toBe(false);
    expect(s.safeParse({ ...mat, domain: 'Domain of Mastery: Blessing', days: ['Monday', 'Sunday'] }).success).toBe(true);
    // Days are localized per language ("Monday" in EN, "周一" in CS), so a fixed enum would
    // reject 14 of 15 languages. Shape is validated; the EN values are checked separately.
    expect(s.safeParse({ ...mat, domain: 'd', days: ['Someday'] }).success).toBe(true);
    expect(EN_DAYS).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    expect(s.safeParse({ ...mat, domain: 'd', days: ['周三', '周六', '周日'] }).success).toBe(true);
    // An empty day string is still a failure.
    expect(s.safeParse({ ...mat, domain: 'd', days: [''] }).success).toBe(false);
  });

  test('domains.json rejects rotation ids that are not valid slugs', () => {
    const s = schemas.domainsRoot;
    const good = { characters: [{ domainName: 'D', rotation: [{ day: 'Monday', ids: ['amber'] }] }], weapons: [] };
    expect(s.safeParse(good).success).toBe(true);
    const bad = { characters: [{ domainName: 'D', rotation: [{ day: 'Monday', ids: [''] }] }], weapons: [] };
    expect(s.safeParse(bad).success).toBe(false);
  });

  test('tcg action and character cards use different attribute shapes', () => {
    const action = schemas.tcg_action;
    const char = schemas.tcg_characters;
    const actionOk = {
      _id: 176081,
      id: 'crystal_shrapnel',
      name: 'Crystal Shrapnel',
      shareId: 1,
      desc: 'x',
      skills: [],
      attributes: { cost: 1, card_type: 'Event Card', energy: [{ _id: 1108, id: 'matching_element', type: 'Matching Element', count: 1 }], source: 'x' },
    };
    const charOk = {
      _id: 1315,
      id: 'mavuika',
      name: 'Mavuika',
      shareId: 478,
      desc: 'x',
      skills: [],
      attributes: { hp: 2, card_type: 'Character Card', energy: 2, element: 'Pyro', weapon: 'Catalyst', faction: [], source: 'x' },
    };
    expect(action.safeParse(actionOk).success).toBe(true);
    expect(char.safeParse(charOk).success).toBe(true);
    // They must NOT be interchangeable — that was a real schema bug caught during tuning.
    expect(char.safeParse(actionOk).success).toBe(false);
    expect(action.safeParse(charOk).success).toBe(false);
  });
});
