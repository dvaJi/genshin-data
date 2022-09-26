type Item = {
  _id: number;
  id: string;
  name: string;
  amount: number;
};

export type WeaponSecondaryMaterial = {
  _id: number;
  id: string;
  name: string;
  description: string;
  source: string[];
  rarity: number;
  craft?: {
    cost: number;
    items: Item[];
  };
};
