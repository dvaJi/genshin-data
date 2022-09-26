export interface Achievement {
  id: number;
  name: string;
  desc: string;
  reward: number;
  hidden: boolean;
  order: number;
}

export interface AchievementCategory {
  _id: number;
  id: string;
  name: string;
  order: number;
  achievements: Achievement[];
}
