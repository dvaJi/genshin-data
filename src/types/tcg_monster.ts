interface SkillPoint {
  _id: number;
  id: string;
  type: string;
  count: number;
}
interface Entity {
  _id: number;
  id: string;
  name: string;
}
export interface MonsterCardSkill {
  id: string;
  name: string;
  desc: string;
  skillTag: string[];
  points: SkillPoint[];
}
export interface TCGMonsterCard {
  _id: number;
  id: string;
  shareId: number;
  name: string;
  title?: string;
  desc?: string;
  attributes: {
    hp: number;
    card_type: string;
    energy: number;
    element: string;
    weapon: string;
    faction: string[];
    source?: string;
    monster?: Entity;
  };
  skills: MonsterCardSkill[];
}
