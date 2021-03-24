type Craft = {
  id: string;
  name: string;
  amount: number;
};

interface Material {
  id: string;
  name: string;
  type: string;
  rarity?: number;
  material_type: string[];
  description: string;
}

export interface CommonMaterial extends Material {
  craft?: {
    name: string;
    amount: number;
    cost: number;
  };
  location: string;
  sources: string[];
}

export interface ElementalStoneMaterial extends Material {}

export interface Ingredients extends Material {
  craft: Craft;
}

export interface JewelMaterial extends Material {
  craft?: Craft;
  sources: string[];
}

export interface LocalMaterial extends Material {
  location: string;
  sources: string[];
}

export interface Potion extends Material {
  sources: string[];
  effect: string;
}

export interface TalentLvlUpMaterial extends Material {
  location: string;
  sources: string[];
  region: string;
  day: string[];
  craft?: Craft;
}

export interface WeaponPrimaryMaterial extends Material {
  location: string;
  sources: string[];
  region: string;
  day: string[];
  craft?: Craft;
}

export interface WeaponSecondaryMaterial extends Material {
  location: string;
  sources: string[];
  region: string;
  craft?: Craft;
}
