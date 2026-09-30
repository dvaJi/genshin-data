#!/usr/bin/env node
/**
 * Cross-checks the local dataset against the yatta.moe changelog for a given game version.
 *
 * Answers the question "is this dump actually up to date with version X?" by asking yatta what
 * changed in X and confirming each new entity exists locally.
 *
 * The changelog endpoint is version-agnostic and returns every version in one document:
 *   GET https://gi.yatta.moe/api/v2/static/changelog
 * Response envelope: { response: 200, data: { "<versionKey>": { version, items }, ... } }
 * There is NO language segment and NO query params — `?version=` is silently ignored.
 *
 * NOTE: yatta's ids are its OWN internal ids and do NOT match the dump's numeric ids
 * (e.g. yatta food 132029 vs dump food max 5502), so entities are matched by NAME, not id.
 * Only `avatar` happens to share the dump's avatar ids.
 *
 * Usage:
 *   node scripts/check-changelog.mjs                # defaults to the latest version
 *   node scripts/check-changelog.mjs --version 7.1
 *   node scripts/check-changelog.mjs --lang english
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, '..', 'src', 'data');

const argv = process.argv.slice(2);
const argOf = (f) => {
  const i = argv.indexOf(f);
  return i === -1 ? undefined : argv[i + 1];
};
const lang = argOf('--lang') || 'english';
const explicitVersion = argOf('--version');

const YATTA = 'https://gi.yatta.moe';
const changelogUrl = `${YATTA}/api/v2/static/changelog`;
const HEADERS = { Accept: 'application/json, text/plain, */*' };

// changelog item type -> { local folder, yatta list endpoint }
// Note the changelog calls it `furniture` while the local folder is `furnishing`.
const CHECKS = {
  avatar: { folder: 'characters', endpoint: 'avatar' },
  weapon: { folder: 'weapons', endpoint: 'weapon' },
  food: { folder: 'food', endpoint: 'food' },
  monster: { folder: 'monsters', endpoint: 'monster' },
  furniture: { folder: 'furnishing', endpoint: 'furniture' },
};

const getJson = async (url) => {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};

/**
 * Resolve changelog ids to names.
 *
 * `GET /api/v2/en/<endpoint>?ids=a,b,c` is only honoured by SOME endpoints — `furniture`
 * silently ignores the filter and returns the whole table, which would make every check pass
 * or fail for the wrong reason. The per-id detail route `GET /api/v2/en/<endpoint>/<id>` is
 * reliable, but costs one request per id, so use the batch call first and fall back to detail
 * for any id the batch did not actually return.
 */
const resolveNames = async (endpoint, ids) => {
  const byId = new Map();

  try {
    const batch = (await getJson(`${YATTA}/api/v2/en/${endpoint}?ids=${ids.join(',')}`)).data?.items ?? {};
    for (const x of Object.values(batch)) {
      // Only trust entries whose id we actually asked for; furniture returns everything.
      if (ids.map(String).includes(String(x.id)) && x.name) byId.set(String(x.id), x);
    }
  } catch {
    /* fall through to per-id lookups */
  }

  const missing = ids.filter((id) => !byId.has(String(id)));
  if (missing.length) {
    const detail = await Promise.allSettled(
      missing.map(async (id) => {
        const d = (await getJson(`${YATTA}/api/v2/en/${endpoint}/${id}`)).data;
        if (d?.name) byId.set(String(id), d);
      })
    );
    const failed = detail.filter((d) => d.status === 'rejected').length;
    if (failed) console.log(`[warn] ${endpoint}: ${failed}/${missing.length} detail lookups failed`);
  }

  return byId;
};

const localNames = (folder) => {
  const dir = path.join(DATA, lang, folder);
  const names = new Map();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (j.name) names.set(String(j.name).toLowerCase().trim(), f);
  }
  return names;
};

const main = async () => {
  console.log(`fetching ${changelogUrl} ...`);
  const cl = await getJson(changelogUrl);
  const versions = cl.data ?? {};
  const keys = Object.keys(versions).sort((a, b) => Number(a) - Number(b));
  const latest = keys[keys.length - 1];
  const key = explicitVersion ? explicitVersion.replace('.', '') : latest;
  const entry = versions[key];

  if (!entry) {
    console.error(`version ${explicitVersion} (key "${key}") not in changelog. available: ${keys.join(', ')}`);
    process.exit(1);
  }

  console.log(`\n=== changelog ${entry.version} (key ${key}), latest is ${versions[latest].version} ===`);
  console.log(`categories: ${Object.entries(entry.items).map(([k, v]) => `${k}(${v.length})`).join(' ')}\n`);

  let missingTotal = 0;
  const allMissing = [];

  for (const [type, { folder, endpoint }] of Object.entries(CHECKS)) {
    const ids = entry.items[type];
    if (!ids) {
      console.log(`[skip] ${type}: not in this version's changelog`);
      continue;
    }

    const local = localNames(folder);
    const byId = await resolveNames(endpoint, ids);

    const missing = [];
    for (const yid of ids) {
      const y = byId.get(String(yid));
      if (!y?.name) {
        missing.push(`${yid} (name unresolved)`);
        continue;
      }
      if (local.has(String(y.name).toLowerCase().trim())) continue;
      missing.push(`${y.name} (yatta ${yid})`);
    }

    missingTotal += missing.length;
    allMissing.push(...missing.map((m) => `${type}: ${m}`));

    const status = missing.length === 0 ? 'OK  ' : 'MISS';
    console.log(`[${status}] ${type.padEnd(10)} -> ${folder.padEnd(24)} ${ids.length - missing.length}/${ids.length} present`);
    if (missing.length) for (const m of missing) console.log(`          - ${m}`);
  }

  console.log(`\ntotal missing: ${missingTotal}`);
  console.log(
    missingTotal === 0
      ? `\nPASS: local "${lang}" data covers every ${entry.version} changelog entity we can map.`
      : `\nNote: verify whether the missing entities are absent from the DUMP (not a pipeline bug).`
  );
  process.exit(0);
};

main().catch((e) => {
  console.error('ERROR', e.message);
  process.exit(1);
});
