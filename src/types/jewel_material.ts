type Item = {
  id: string;
  name: string;
  amount: number;
};

export type JewelMaterial = {
  id: string;
  name: string;
  description: string;
  source: string[];
  rarity: number;
  craft?: {
    cost: number;
    items: Item[];
  };
  convert?: Array<Item[]>;
};
