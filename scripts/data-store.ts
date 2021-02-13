type DataMaps = {
  artifacts: Map<string, unknown>;
  materials: Map<string, unknown>;
  weapons: Map<string, unknown>;
  builds: Map<string, unknown>;
  common: Map<string, unknown>;
  characters: Map<string, unknown>;
};

type MapsKeys = keyof DataMaps;

class DataStore {
  originalData: DataMaps;
  currentData: DataMaps;

  constructor() {
    this.originalData = {
      artifacts: new Map(),
      materials: new Map(),
      weapons: new Map(),
      builds: new Map(),
      common: new Map(),
      characters: new Map(),
    };

    this.currentData = {
      artifacts: new Map(),
      materials: new Map(),
      weapons: new Map(),
      builds: new Map(),
      common: new Map(),
      characters: new Map(),
    };
  }

  setCurrentData(data: Map<string, unknown>, map: MapsKeys, lang: string) {
    if (lang === 'english') {
      this.originalData[map] = data;
    }

    this.currentData[map].clear();
    this.currentData[map] = data;
  }

  getArtifact(id: string) {
    return this.getValueFromMap('artifacts', id);
  }

  hasArtifact(id: string) {
    return this.hasValue('artifacts', id);
  }

  getMaterial(id: string) {
    return this.getValueFromMap('materials', id);
  }

  hasMaterial(id: string) {
    return this.hasValue('materials', id);
  }

  getWeapon(id: string) {
    return this.getValueFromMap('weapons', id);
  }

  hasWeapon(id: string) {
    return this.hasValue('weapons', id);
  }

  getBuild(id: string) {
    return this.getValueFromMap('builds', id);
  }

  hasBuild(id: string) {
    return this.hasValue('builds', id);
  }

  getCommon(id: string) {
    return this.getValueFromMap('common', id);
  }

  hasCommon(id: string) {
    return this.hasValue('common', id);
  }

  getValueFromMap(map: MapsKeys, id: string) {
    if (this.currentData[map].has(id)) {
      return this.currentData[map].get(id);
    }

    return this.originalData[map].get(id);
  }

  hasValue(map: MapsKeys, id: string): boolean {
    return this.currentData[map].has(id) || this.originalData[map].has(id);
  }
}

exports.default = DataStore;
