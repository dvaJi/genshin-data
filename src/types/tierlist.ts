interface CharacterTier {
  id: string;
  min_c: number;
}

interface Tier {
  '0': CharacterTier[];
  '1': CharacterTier[];
  '2': CharacterTier[];
  '3': CharacterTier[];
  '4': CharacterTier[];
}

export interface Tierlist {
  maindps: Tier;
  subdps: Tier;
  support: Tier;
}
