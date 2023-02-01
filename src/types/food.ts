type Ingredient = {
  id: string;
  name: string;
  amount: number;
};

type FoodResult = {
  normal: {
    _id: number;
    name: string;
    description: string;
    effect: string;
  };
  delicious: {
    _id: number;
    name: string;
    description: string;
    effect: string;
  };
  suspicious: {
    _id: number;
    name: string;
    description: string;
    effect: string;
  };
  special?: {
    _id: number;
    id: string;
    name: string;
    description: string;
    effect: string;
    character: {
      id: string;
      name: string;
    };
  };
};

export interface Food {
  _id: number;
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  dish_type: string;
  results: FoodResult;
  rarity: number;
}
