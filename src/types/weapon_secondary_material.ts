type Item = {
  id: string;
  name: string;
  amount: number;
};

export type WeaponSecondaryMaterial = {
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
