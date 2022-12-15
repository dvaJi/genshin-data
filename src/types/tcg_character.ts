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
export interface CharacterCardSkill {
  id: string;
  name: string;
  desc: string;
  skillTag: string[];
  points: SkillPoint[];
}
export interface TCGCharacterCard {
  _id: number;
  id: string;
  name: string;
  attributes: {
    hp: number;
    card_type: string;
    energy: number;
    element: string;
    weapon: string;
    faction: string[];
    talent_card?: Entity;
    source: string[];
    character?: Entity;
  };
  skills: CharacterCardSkill[];
}
