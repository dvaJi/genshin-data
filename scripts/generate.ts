const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const DATA_PATH = path.join(__dirname, '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', 'src', 'generated');

const FOLDERS = ['characters'];
const LANGUAGES = ['english', 'spanish', 'japanese'];

const log = console.log;

const artifactsMap = new Map();
const materialsMap = new Map();
const weaponsMap = new Map();
const buildsMap = new Map();
const charactersMapLite = new Map();

async function main() {
  log('Init script...');

  // Iterate through each language
  for await (const lang of LANGUAGES) {
    log(chalk.yellow(`Creating files for [${lang}] content:`));

    // Get materials|artifacts|weapons
    generateMaterials(lang);
    generateArtifacts(lang);
    generateWeapons(lang);
    generateBuildAndTier(lang);

    // Iterate through each folder
    for await (const folder of FOLDERS) {
      let index: any[] = [];
      try {
        const folderPath = path.join(
          DATA_PATH,
          lang === 'english' ? 'general' : lang,
          folder
        );
        fs.readdirSync(folderPath).forEach((filename: string) => {
          if (!filename.endsWith('.json')) return;
          const data = require(path.join(folderPath, filename));
          const originalData = require(path.join(
            DATA_PATH,
            'general',
            folder,
            filename
          ));

          let fmtData = null;

          if (folder === 'characters') {
            fmtData = generateCharacters(originalData, data);
          } else {
            fmtData = { ...originalData, ...data };
          }

          index.push(fmtData);
        });

        fs.writeFileSync(
          path.join(GENERATED_PATH, lang, `${folder}.json`),
          JSON.stringify(index, null, '\t')
        );

        log(chalk.green(`[✓] ${folder}.json created`));
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function generateCharacters(originalData: any, newData: any) {
  // log(chalk.blue(`>> generating character [${originalData.name}]`));
  let fmtData = deepMerge(originalData, newData);

  charactersMapLite.set(fmtData.id, {
    id: fmtData.id,
    name: fmtData.name,
    description: fmtData.description,
  });

  // append builds and tier
  if (buildsMap.has(fmtData.id)) {
    fmtData = { ...fmtData, ...renameBuilds(buildsMap.get(fmtData.id)) };
  }

  fmtData.ascension = originalData.ascension.map((s: any) => {
    const mat2 = s.mat2
      ? {
          mat2: {
            ...s.mat2,
            id: slugify(s.mat2.name),
            name: materialsMap.get(slugify(s.mat2?.name)),
          },
        }
      : {};
    return {
      ...s,
      mat1: {
        ...s.mat1,
        id: slugify(s.mat1.name),
        name: materialsMap.get(slugify(s.mat1?.name)),
      },
      ...mat2,
      mat3: {
        ...s.mat3,
        id: slugify(s.mat3.name),
        name: materialsMap.get(slugify(s.mat3?.name)),
      },
      mat4: {
        ...s.mat4,
        id: slugify(s.mat4?.name),
        name: materialsMap.get(slugify(s.mat4?.name)),
      },
    };
  });

  return fmtData;
}

function generateMaterials(lang: string) {
  let materials: any[] = [];
  const materialsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'materials'
  );
  fs.readdirSync(materialsPath).forEach((filename: string) => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(materialsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'materials',
      filename
    ));

    let fmtData = deepMerge(originalData, data);

    if (originalData.type === 'Ascension Gems Material') {
      originalData.quality.forEach((quality: any, index: number) => {
        const tlMaterial = data.quality[index];
        let material = {
          ...deepMerge(quality, tlMaterial),
          type: originalData.type,
          material_type: originalData.material_type,
          gem_type: data.name,
        };

        materialsMap.set(material.id, material.name);

        materials.push(material);
      });
    } else {
      materialsMap.set(fmtData.id, fmtData.name);
      materials.push(fmtData);
    }
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `materials.json`),
    JSON.stringify(materials, null, '\t')
  );

  log(chalk.green(`[✓] materials.json created`));

  return materials;
}

function generateArtifacts(lang: string) {
  let artifacts: any[] = [];
  const artifactsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'artifacts'
  );
  fs.readdirSync(artifactsPath).forEach((filename: string) => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(artifactsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'artifacts',
      filename
    ));

    const fmtData = deepMerge(originalData, data);
    artifactsMap.set(fmtData.id, fmtData.name);
    artifacts.push(fmtData);
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `artifacts.json`),
    JSON.stringify(artifacts, null, '\t')
  );

  log(chalk.green(`[✓] artifacts.json created`));

  return artifacts;
}

function generateWeapons(lang: string) {
  let weapons: any[] = [];
  const weaponsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'weapons'
  );
  fs.readdirSync(weaponsPath).forEach((filename: string) => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(weaponsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'weapons',
      filename
    ));

    const fmtData = deepMerge(originalData, data);
    weaponsMap.set(fmtData.id, fmtData.name);
    weapons.push(fmtData);
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `weapons.json`),
    JSON.stringify(weapons, null, '\t')
  );

  log(chalk.green(`[✓] weapons.json created`));

  return weapons;
}

function generateBuildAndTier(lang: string) {
  const tierlist: any = {
    maindps: {},
    subdps: {},
    support: {},
  };

  const buildsPath = getFolder(lang, 'builds_and_tier');
  const originalBuildsPath = getFolder('general', 'builds_and_tier');
  fs.readdirSync(originalBuildsPath).forEach((filename: string) => {
    if (!filename.endsWith('.json')) return;

    const id = filename.replace('.json', '');
    const originalData = require(path.join(originalBuildsPath, filename));

    let fmtData = originalData;

    if (fs.existsSync(path.join(buildsPath, filename))) {
      const data = require(path.join(buildsPath, filename));
      fmtData = deepMerge(originalData, data);
    }

    if (fmtData.tier) {
      const roles = ['maindps', 'subdps', 'support'];
      for (const role of roles) {
        if (fmtData.tier[role]) {
          tierlist[role][fmtData.tier[role].tier] = [
            ...(tierlist[role][fmtData.tier[role].tier] || []),
            { id, min_c: fmtData.tier[role].c },
          ];
        }
      }
    }

    if (fmtData.builds) {
      fmtData.builds = fmtData.builds.map((build: any) => {
        build.weapons = build.weapons.map((w: any) => ({
          ...w,
          id: slugify(w.name),
          name: weaponsMap.get(slugify(w.name)),
        }));

        build.sets = build.sets.map((s: any) => {
          if (s.set_2) {
            return {
              ...s,
              set_1: {
                id: slugify(s.set_1.name),
                name: artifactsMap.get(slugify(s.set_1.name)),
              },
              set_2: {
                id: slugify(s.set_2.name),
                name: artifactsMap.get(slugify(s.set_2.name)),
              },
            };
          } else {
            return {
              ...s,
              set_1: {
                id: slugify(s.set_1.name),
                name: artifactsMap.get(slugify(s.set_1.name)),
              },
            };
          }
        });

        return build;
      });
    }

    buildsMap.set(id, fmtData);
  });

  log(chalk.green(`[✓] builds loaded`));

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `tierlist.json`),
    JSON.stringify(tierlist, null, '\t')
  );

  log(chalk.green(`[✓] tierlist.json created`));
}

function getFolder(lang: string, folder: string): string {
  return path.join(DATA_PATH, lang === 'english' ? 'general' : lang, folder);
}

function slugify(value: string) {
  if (!value) return '';

  return value
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/\W/g, '')
    .replace(/\__+/g, '_');
}

function renameBuilds(data: any) {
  if (!data.builds) return data;

  data.builds = data.builds.map((build: any) => {
    build.weapons = build.weapons.map((w: any) => {
      if (weaponsMap.has(slugify(w.name))) {
        return {
          ...w,
          id: slugify(w.name),
          name: weaponsMap.get(slugify(w.name)),
        };
      }

      return w;
    });

    build.sets = build.sets.map((s: any) => {
      if (s.set_2) {
        return {
          ...s,
          set_1: artifactsMap.has(slugify(s.set_1.name))
            ? {
                id: slugify(s.set_1.name),
                name: artifactsMap.get(slugify(s.set_1.name)),
              }
            : s.set_1,
          set_2: artifactsMap.has(slugify(s.set_2.name))
            ? {
                id: slugify(s.set_2.name),
                name: artifactsMap.get(slugify(s.set_2.name)),
              }
            : s.set_2,
        };
      } else {
        return {
          ...s,
          set_1: artifactsMap.has(slugify(s.set_1.name))
            ? {
                id: slugify(s.set_1.name),
                name: artifactsMap.get(slugify(s.set_1.name)),
              }
            : s.set_1,
        };
      }
    });

    return build;
  });

  return data;
}

function deepMerge(a: any, b: any) {
  let newObj: any = { ...a };

  if (!a || !b) return newObj;

  if (a && slugify(a.name)) newObj['id'] = slugify(a.name);

  Object.keys(b).forEach(key => {
    const value = b[key];

    if (Array.isArray(value) && typeof value !== 'string') {
      newObj[key] = value.map((v: any, i: number) => {
        if (typeof v === 'string') {
          return v;
        } else {
          return deepMerge(a[key][i], v);
        }
      });
    } else if (typeof value === 'object') {
      newObj[key] = deepMerge(a[key], b[key]);
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}

main();
