type Item = {
  _id: number;
  id: string;
  name: string;
  amount: number;
};

type Craft = {
  cost: number;
  items: Item[];
};

export type CommonMaterial = {
  _id: number;
  id: string;
  name: string;
  description: string;
  source: string[];
  rarity: number;
  craft?: Craft;
};
