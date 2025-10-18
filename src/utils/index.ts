import type { QueryOpts } from '../types/options';
import type { Languages } from '../types/language';
import type { Folders } from '../types/folders';

export async function findByFolder<T>(
  lang: Languages,
  folder: Folders,
  query?: QueryOpts<T>
): Promise<T[]> {
  let results = (await import(`../min/data_${lang}_${folder}.min.json`))
    .default;

  if (query) {
    results = selectProps(results, query);
  }

  return results;
}

function selectProps<T>(results: T[], query: QueryOpts<T>): T[] {
  if (query.select) {
    return results.map((result) => {
      const obj: Partial<T> = {};
      query.select?.forEach((key) => {
        obj[key] = result[key];
      });

      return obj as T;
    });
  }

  return results;
}
