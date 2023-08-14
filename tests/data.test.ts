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

  const count = {};
  for await (const locale of locales) {
    const files = await fs.readdir(`src/data/${locale}`);
    for await (const file of files) {
      if (file.endsWith('.json')) {
        count[locale] = count[locale] ? count[locale] + 1 : 1;
        continue;
      }

      const data = await fs.readdir(`src/data/${locale}/${file}`, 'utf-8');

      data.forEach((d) => {
        count[locale] = count[locale] ? count[locale] + 1 : 1;
      });
    }
  }

  // Compare all files result recursively
  console.log(count)
  Object.values(count).forEach((file) => {
    Object.values(count).forEach((file2) => {
      expect(file).toEqual(file2);
    });
  });
});
