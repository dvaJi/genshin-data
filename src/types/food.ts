type Ingredient = {
  id: string;
  name: string;
  amount: number;
};

type FoodResult = {
  normal: {
    description: string;
    effect: string;
  };
  delicious: {
    description: string;
    effect: string;
  };
  suspicious: {
    description: string;
    effect: string;
  };
  special?: {
    description: string;
    effect: string;
    character: {
      id: string;
      name: string;
    };
  };
};

export interface Food {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  dish_type: string;
  results: FoodResult;
  rarity: number;
}
