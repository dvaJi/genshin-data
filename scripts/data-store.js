const keyv = require('keyv');

const dataCache = new keyv();

class DataStore {
  originalData;
  currentData;

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

  setCurrentData(data, map, lang) {
    if (lang === 'english') {
      this.originalData[map] = data;
    }

    this.currentData[map].clear();
    this.currentData[map] = data;
  }

  getArtifact(id) {
    return this.getValueFromMap('artifacts', id);
  }

  hasArtifact(id) {
    return this.hasValue('artifacts', id);
  }

  getMaterial(id) {
    return this.getValueFromMap('materials', id);
  }

  hasMaterial(id) {
    return this.hasValue('materials', id);
  }

  getWeapon(id) {
    return this.getValueFromMap('weapons', id);
  }

  hasWeapon(id) {
    return this.hasValue('weapons', id);
  }

  getBuild(id) {
    return this.getValueFromMap('builds', id);
  }

  hasBuild(id) {
    return this.hasValue('builds', id);
  }

  getCommon(id) {
    return this.getValueFromMap('common', id);
  }

  hasCommon(id) {
    return this.hasValue('common', id);
  }

  getValueFromMap(map, id) {
    if (this.currentData[map].has(id)) {
      return this.currentData[map].get(id);
    }

    return this.originalData[map].get(id);
  }

  hasValue(map, id) {
    return this.currentData[map].has(id) || this.originalData[map].has(id);
  }
}

exports.default = DataStore;

exports.dataCache = dataCache;
