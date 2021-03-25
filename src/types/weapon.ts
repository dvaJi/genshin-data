type WeaponStat = {
  name: string;
  value: number;
};

type AscensionMaterial = {
  id: string;
  name: string;
  amount: number;
};

type WeaponAscension = {
  ascensionLevel: number;
  maxLevel: number;
  primary: number;
  secondary: number;
  materials: AscensionMaterial[];
};

type WeaponRefinement = {
  refinement: number;
  name: string;
  desc: string;
};

export interface Weapon {
  id: string;
  name: string;
  description: string;
  rarity: number;
  type: string;
  primary: WeaponStat;
  secondary?: WeaponStat;
  bonus: string;
  ascensions: WeaponAscension[];
  refinements: WeaponRefinement[];
}
