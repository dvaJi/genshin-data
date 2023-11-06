import { assert, expect, test } from 'vitest';
import fs from 'fs/promises';

test('All data folders are equal', async () => {
  const locales = await fs.readdir('src/data');

  const files = await Promise.all(
    locales.map(async (locale) => {
      const files = await fs.readdir(`src/data/${locale}`);
      return { locale, files };
    })
  );

  // console.log(files);
  expect(files.length).toEqual(15);

  // Compare all files result recursively
  files.forEach((file) => {
    files.forEach((file2) => {
      if (file.locale !== file2.locale) {
        expect(file.files).toEqual(file2.files);
      }
    });
  });
});

test('All files are equal', async () => {
  const locales = await fs.readdir('src/data');

  let allFiles = {};
  for await (const locale of locales) {
    const folders = await fs.readdir(`src/data/${locale}`);

    for (const folder of folders) {
      if (folder.endsWith('.json')) continue;
      const files = await fs.readdir(`src/data/${locale}/${folder}`);
      if (!allFiles[locale]) {
        allFiles[locale] = [];
      }

      allFiles[locale].push(...files);
    }
  }

  // Compare all files result recursively
  console.log(allFiles);
  Object.values(allFiles).forEach((file) => {
    Object.values(allFiles).forEach((file2) => {
      expect(file).toEqual(file2);
    });
  });
});
