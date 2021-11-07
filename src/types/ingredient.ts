type Item = {
  id: string;
  name: string;
  amount: number;
};

type Recipe = {
  id: string;
  name: string;
};

export type Ingredients = {
  id: string;
  name: string;
  description: string;
  processing?: Item[];
  recipes?: Recipe[];
};
