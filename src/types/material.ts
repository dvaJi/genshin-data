export interface GemsMaterial {
  id: string;
  name: string;
  description: string;
  type: string;
  material_type: string[];
  craft?: {
    name: string;
    amount: number;
    cost: number;
  };
  rarity: number;
  sources: string[];
}

export interface Material {
  id: string;
  name: string;
  type: string;
  rarity?: number;
  material_type: string[];
  description: string;
  location?: string;
  sources?: string[];
}
