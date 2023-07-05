export interface SkillAttribute {
  label: string;
  values: string[];
}

export interface Skill {
  _id: number;
  id: string;
  name: string;
  description: string;
  info: string;
  attributes: SkillAttribute[];
}

export interface Passive {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface Constellation {
  _id: number;
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface AscensionMaterial {
  _id: number;
  id: string;
  name: string;
  amount: number;
  rarity: number;
}

export type AscendStat = {
  label: string;
  values: (string | number)[] | null;
};
export interface Ascension {
  level: [number, number];
  cost?: number;
  stats: AscendStat[];
  mat1?: AscensionMaterial;
  mat2?: AscensionMaterial;
  mat3?: AscensionMaterial;
  mat4?: AscensionMaterial;
}

export type CharacterVoice = {
  english: string;
  chinese: string;
  japanese: string;
  korean: string;
};

export type TalentMaterial = {
  level: number;
  cost: number;
  items: AscensionMaterial[];
};

export interface Character {
  _id: number;
  id: string;
  name: string;
  title?: string;
  description: string;
  weapon_type: string;
  element: string;
  gender: string;
  substat: string;
  affiliation: string;
  region?: string;
  rarity: number;
  birthday: [number | null, number | null];
  constellation: string;
  domain: string;
  cv: CharacterVoice;
  skills: Skill[];
  passives: Passive[];
  constellations: Constellation[];
  ascension: Ascension[];
  talent_materials: TalentMaterial[];
}
