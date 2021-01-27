export interface Weapon {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  rarity: number;
  base: number;
  secondary?: string;
  passive: string;
  bonus?: string;
  series?: string;
}
