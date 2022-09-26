type Item = {
  _id: number;
  id: string;
  name: string;
  amount: number;
};

type Recipe = {
  _id: number;
  id: string;
  name: string;
};

export type Ingredients = {
  _id: number;
  id: string;
  name: string;
  description: string;
  processing?: Item[];
  recipes?: Recipe[];
};
