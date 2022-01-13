export interface Achievement {
  id: number;
  name: string;
  desc: string;
  reward: number;
  hidden: boolean;
  order: number;
}

export interface AchievementCategory {
  id: string;
  originalId: number;
  name: string;
  order: number;
  achievements: Achievement[];
}
