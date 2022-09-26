export type Fish = {
  _id: number;
  id: string;
  name: string;
  description: string;
  rarity: number;
  source: string[];
  bait: {
    id: string;
    name: string;
    rarity: number;
  };
};

export type FishingRod = {
  _id: number;
  id: string;
  name: string;
  description: string;
  rarity: number;
  source: string[];
};

type CraftItem = {
  id: string;
  name: string;
  amount: number;
};

type Craft = {
  items: CraftItem[];
  result: number;
};

type FishBait = {
  _id: number;
  id: string;
  name: string;
  rarity: number;
};

export type Bait = {
  _id: number;
  id: string;
  name: string;
  description: string;
  rarity: number;
  craft: Craft;
  fish: FishBait[];
};
