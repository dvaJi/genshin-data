type Item = {
  _id: number;
  id: string;
  name: string;
  amount: number;
};

export type JewelMaterial = {
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
  convert?: Array<Item[]>;
};
