export interface ActionCardSkill {
  name: string;
  desc: string;
}
interface Entity {
  _id: number;
  id: string;
  name: string;
  rarity: number;
}
interface Energy {
  _id: number;
  id: string;
  type: string;
  count: number;
}
export interface TCGActionCard {
  _id: number;
  id: string;
  shareId: number;
  name: string;
  title: string;
  desc: string;
  in_play_description: string;
  attributes: {
    cost: number;
    cost_type: string;
    card_type: string;
    energy: Energy[];
    source: string;
    artifact?: Entity;
    character?: Entity;
    food?: Entity;
    weapon?: Entity;
    tags: string[];
  };
  skills: ActionCardSkill[];
}
