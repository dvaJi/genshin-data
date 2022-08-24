type Item = {
  day: string;
  ids: string[];
};

type DomainType = {
  domainName: string;
  rotation: Item[];
};

export type Domains = {
  characters: DomainType[];
  weapons: DomainType[];
};
