interface ArtifactSet {
  id: string;
  name: string;
  description?: string;
}

export interface Artifact {
  id: string;
  name: string;
  min_rarity: number;
  max_rarity: number;
  flower?: ArtifactSet;
  plume?: ArtifactSet;
  sands?: ArtifactSet;
  goblet?: ArtifactSet;
  circlet?: ArtifactSet;
  '1pc'?: string;
  '2pc'?: string;
  '4pc'?: string;
  drop: {
    '1'?: string[];
    '2'?: string[];
    '3'?: string[];
    '4'?: string[];
    '5'?: string[];
  };
}
