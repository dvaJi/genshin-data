export interface Skill {
  id: string;
  name: string;
  description: string;
  info: string;
  attributes: Array<[string, string[]]>;
}

export interface Passive {
  id: string;
  name: string;
  description: string;
  level: number;
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
  level: [number, number];
  cost: number;
  mat1: AscensionMaterial;
  mat2?: AscensionMaterial;
  mat3: AscensionMaterial;
  mat4: AscensionMaterial;
}

type CharacterVoice = {
  english: string;
  chinese: string;
  japanese: string;
  korean: string;
};

type TalentMaterial = {
  level: number;
  cost: number;
  items: AscensionMaterial[];
};

export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  weapon_type: string;
  element: string;
  gender: string;
  substat: string;
  affiliation: string;
  region: string;
  rarity: number;
  birtday: [number, number];
  constellation: string;
  cv: CharacterVoice;
  skills: Skill[];
  passives: Passive[];
  constellations: Constellation[];
  ascension: Ascension[];
  talent_materials: TalentMaterial[];
}
