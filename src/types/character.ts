interface BuildSet {
  set_1: {
    id: string;
    name: string;
  };
  set_2?: {
    id: string;
    name: string;
  };
  order: number;
}

interface BuildWeapon {
  id: string;
  name: string;
  order: number;
}

interface SetsStats {
  flower: string[];
  plume: string[];
  sands: string[];
  goblet: string[];
  circlet: string[];
}

interface Build {
  id: string;
  name: string;
  description: string;
  role: string;
  weapons: BuildWeapon[];
  sets: BuildSet[];
  stats_priority: string[];
  stats: SetsStats;
}

export interface SkillModifier {
  stat: string;
  value: string;
}

export interface Skill {
  id: string;
  name: string;
  type: string;
  description: string;
  modifiers?: SkillModifier[];
}

export interface Passive {
  id: string;
  name: string;
  unlock?: string;
  description: string;
}

export interface Constellation {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface AscensionMaterial {
  id: string;
  name: string;
  amount: number;
}

export interface Ascension {
  ascension: number;
  level: number;
  cost: number;
  mat1: AscensionMaterial;
  mat2?: AscensionMaterial;
  mat3: AscensionMaterial;
  mat4: AscensionMaterial;
}

interface Tier {
  c: number;
  tier: number;
}

export interface CharacterTier {
  maindps?: Tier;
  subdps?: Tier;
  support?: Tier;
}

export interface BuildsAndTier {
  tier?: CharacterTier;
  builds?: Build[];
}

export interface Character extends BuildsAndTier {
  id: string;
  name: string;
  region: string;
  description: string;
  location: string;
  rarity: number;
  element: string;
  weapon_type: string;
  gender: string;
  titles: string[];
  skills: Skill[];
  passives: Passive[];
  constellations: Constellation[];
  ascension: Ascension[];
}
