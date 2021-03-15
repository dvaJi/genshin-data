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

export interface Character {
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
