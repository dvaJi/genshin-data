export type Fish = {
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
  id: string;
  name: string;
  rarity: number;
};

export type Bait = {
  id: string;
  name: string;
  description: string;
  rarity: number;
  craft: Craft;
  fish: FishBait[];
};
