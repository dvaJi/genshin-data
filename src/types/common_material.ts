type Item = {
  id: string;
  name: string;
  amount: number;
};

type Craft = {
  cost: number;
  items: Item[];
};

export type CommonMaterial = {
  id: string;
  name: string;
  description: string;
  source: string[];
  rarity: number;
  craft?: Craft;
};
