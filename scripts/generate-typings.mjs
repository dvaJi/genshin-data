import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  TypeScriptTargetLanguage,
} from 'quicktype-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_PATH = path.join(__dirname, '..', 'src', 'data');
const TYPES_PATH = path.join(__dirname, '..', 'src', 'types');

const getPluralToSingular = (word) => {
  const rules = {
    artifacts: 'artifact',
    achievements: 'achievement',
    characters: 'character',
    common_materials: 'common_material',
    domains: 'domain',
    elemental_stone_materials: 'elemental_stone_material',
    ingredients: 'ingredient',
    jewels_materials: 'jewel_material',
    local_materials: 'local_material',
    potions: 'potion',
    talent_lvl_up_materials: 'talent_lvl_up_material',
    tcg_characters: 'tcg_character',
    tcg_monsters: 'tcg_monster',
    weapons: 'weapon',
    weapon_primary_materials: 'weapon_primary_material',
    weapon_secondary_materials: 'weapon_secondary_material',
  };
  return rules[word] || word;
};

async function readJsonFiles(dir) {
  const files = await fs.readdir(dir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));
  const data = await Promise.all(
    jsonFiles.map(async (file) => {
      try {
        const content = await fs.readFile(path.join(dir, file), 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
        throw e;
      }
    })
  );
  return data;
}

async function combineData() {
  console.log('Generating typings...');
  const languages = await fs.readdir(GENERATED_PATH);
  const foldersData = {};

  for (const lang of languages) {
    const langPath = path.join(GENERATED_PATH, lang);
    const folders = await fs.readdir(langPath);

    for (const folder of folders) {
      const folderPath = path.join(langPath, folder);
      const stats = await fs.stat(folderPath);

      if (stats.isDirectory()) {
        const data = await readJsonFiles(folderPath);
        foldersData[folder] = (foldersData[folder] || []).concat(data);
      } else if (folder.endsWith('.json')) {
        const content = await fs.readFile(folderPath, 'utf-8');
        foldersData[folder] = (foldersData[folder] || []).concat(
          JSON.parse(content)
        );
      }
    }
  }

  for (const folder in foldersData) {
    const data = foldersData[folder];
    const { lines } = await quicktypeJSON(
      getPluralToSingular(folder),
      JSON.stringify(data)
    );
    const newFilePath = path.join(
      TYPES_PATH,
      `${getPluralToSingular(folder).replace('.json', '')}.ts`
    );
    await fs.writeFile(newFilePath, lines.join('\n'));
    console.log(newFilePath);
  }

  console.log('Typings generated!');
}

async function quicktypeJSON(typeName, jsonString) {
  const targetLanguage = new TypeScriptTargetLanguage();
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    inferEnums: false,
    leadingComments: [`This file was auto-generated by quicktype.`],
    rendererOptions: {
      runtimeTypecheck: false,
      'runtime-typecheck': false,
    },
  });
}

async function main() {
  await combineData();
}

main();
