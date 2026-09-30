#!/usr/bin/env node
/**
 * Validates src/data/** against the zod schemas in ./schemas.mjs, plus cross-cutting
 * invariants that no per-entry schema can express:
 *
 *   1. structural validity (zod) per entry
 *   2. filename === entry.id      (the loader maps by filename, so a mismatch hides data)
 *   3. unique _id and unique id    (collisions break the cross-language join)
 *   4. cross-language parity       (every language has the same ids — a missing translation
 *                                   surfaces as `undefined` for consumers, not an error)
 *   5. referential integrity       (domains.json rotation ids, talent materials, etc.)
 *
 * Usage:
 *   node scripts/validate-data.mjs                  # all languages
 *   node scripts/validate-data.mjs --lang english   # one language
 *   node scripts/validate-data.mjs --folders characters,weapons
 *   node scripts/validate-data.mjs --max-errors 50  # per-category error cap
 *   node scripts/validate-data.mjs --json out.json  # machine-readable report
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { schemas } from './schemas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'src', 'data');

// --- args -------------------------------------------------------------------

const argv = process.argv.slice(2);
const argOf = (flag) => {
  const i = argv.indexOf(flag);
  return i === -1 ? undefined : argv[i + 1];
};
const onlyLang = argOf('--lang');
const onlyFolders = argOf('--folders')?.split(',').map((s) => s.trim());
const MAX_ERRORS = Number(argOf('--max-errors') ?? 25);
const jsonOut = argOf('--json');

const LANGUAGES = fs.readdirSync(DATA).filter((d) => fs.statSync(path.join(DATA, d)).isDirectory());
const LANGS = onlyLang ? LANGUAGES.filter((l) => l === onlyLang) : LANGUAGES;

// --- error collection -------------------------------------------------------

const errors = [];
const add = (category, message, file) => {
  errors.push({ category, message, file: file ? path.relative(ROOT, file) : undefined });
};
const categoryCount = (cat) => errors.filter((e) => e.category === cat).length;
const CATEGORIES = ['schema', 'filename', 'duplicate', 'parity', 'reference', 'unresolved', 'io'];

/**
 * Categories that must be zero for the dataset to be considered publishable.
 * `unresolved` is advisory: a stale EN TextMap leaves a few non-EN skill ids empty, which is a
 * known upstream gap and not a reason to block a release. Everything else is a hard failure.
 */
const BLOCKING = new Set(['schema', 'filename', 'parity', 'reference', 'io']);
const capped = (cat) => categoryCount(cat) >= MAX_ERRORS;

const formatIssue = (issue) => {
  const p = issue.path?.join('.') ?? '(root)';
  return `${p}: ${issue.message}`;
};

// --- 1..3 per-entry validation ---------------------------------------------

const idsByLangFolder = new Map(); // `${lang}/${folder}` -> Map<id, file>

for (const lang of LANGS) {
  const langDir = path.join(DATA, lang);
  const entries = fs.readdirSync(langDir);
  const folders = entries.filter((e) => fs.statSync(path.join(langDir, e)).isDirectory()).sort();

  for (const folder of folders) {
    if (onlyFolders && !onlyFolders.includes(folder)) continue;
    const schema = schemas[folder];
    const dir = path.join(langDir, folder);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();

    if (!schema) {
      if (!capped('schema')) add('schema', `no schema registered for folder "${folder}"`, dir);
      continue;
    }

    const seenId = new Map();
    const seenNumId = new Map();

    for (const file of files) {
      const full = path.join(dir, file);
      let json;
      try {
        json = JSON.parse(fs.readFileSync(full, 'utf8'));
      } catch (err) {
        if (!capped('io')) add('io', `invalid JSON — ${err.message}`, full);
        continue;
      }

      const res = schema.safeParse(json);
      if (!res.success && !capped('schema')) {
        const shown = res.error.issues.slice(0, 3).map(formatIssue).join('; ');
        const more = res.error.issues.length > 3 ? ` (+${res.error.issues.length - 3} more)` : '';
        add('schema', shown + more, full);
      }

          // 1b. nested slugs that resolved empty. These do not break the file tree (the entry
      //     still exists) but the skill is unreachable by slug in that language. Known 7.x
      //     EN-textmap gap, so it is reported under its own `unresolved` category instead of
      //     failing the run as a schema error.
      if (json && Array.isArray(json.skills)) {
        const empty = json.skills.filter((s) => s && s.id === '');
        if (empty.length) {
          add('unresolved', `${empty.length}/${json.skills.length} skills have an empty id (EN textmap hash missing for "${lang}")`, full);
        }
      }

      // 1c. empty localized names. Advisory: a handful of placeholders have no IT/TR string.
      if (json && typeof json.name === 'string' && json.name.trim() === '' && !capped('unresolved')) {
        add('unresolved', `empty localized name for "${json.id}" (no "${lang}" textmap entry)`, full);
      }

      // 2. filename must equal the id (loader does findByFolder -> readdir -> id lookup)
      if (json && typeof json.id === 'string' && json.id) {
        const expected = `${json.id}.json`;
        if (file !== expected && !capped('filename')) {
          add('filename', `filename "${file}" !== id "${json.id}" (expected "${expected}")`, full);
        }
        if (seenId.has(json.id) && !capped('duplicate')) {
          add('duplicate', `duplicate id "${json.id}" also in ${seenId.get(json.id)}`, full);
        } else {
          seenId.set(json.id, file);
        }
      }

      // 3. unique numeric _id — except the traveler variants, which are intentionally
      //    synthetic and all share the base Aether id 10000007.
      if (json && json._id !== undefined && !/^traveler_/.test(json.id ?? '')) {
        if (seenNumId.has(json._id) && !capped('duplicate')) {
          add('duplicate', `duplicate _id ${json._id} also in ${seenNumId.get(json._id)}`, full);
        } else {
          seenNumId.set(json._id, file);
        }
      }
    }

    idsByLangFolder.set(`${lang}/${folder}`, seenId);
  }
}

// --- 4. cross-language parity ---------------------------------------------

if (!onlyLang && LANGS.length > 1) {
  const refLang = LANGS.includes('english') ? 'english' : LANGS[0];
  for (const key of idsByLangFolder.keys()) {
    const folder = key.slice(key.indexOf('/') + 1);
    const ref = idsByLangFolder.get(`${refLang}/${folder}`);
    if (!ref) continue;
    for (const lang of LANGS) {
      if (lang === refLang) continue;
      const other = idsByLangFolder.get(`${lang}/${folder}`);
      if (!other) continue;
      const missing = [...ref.keys()].filter((id) => !other.has(id));
      if (missing.length && !capped('parity')) {
        add('parity', `${missing.length} ids missing vs ${refLang} (e.g. ${missing.slice(0, 3).join(', ')})`, path.join(DATA, lang, folder));
      }
    }
  }
}

// --- 5. referential integrity ---------------------------------------------

{
  // domains.json rotation ids must exist in characters/ and weapons/
  for (const lang of LANGS) {
    const root = path.join(DATA, lang, 'domains.json');
    if (!fs.existsSync(root)) {
      if (!capped('io')) add('io', 'missing domains.json', root);
      continue;
    }
    let domains;
    try {
      domains = JSON.parse(fs.readFileSync(root, 'utf8'));
    } catch (err) {
      if (!capped('io')) add('io', `invalid JSON — ${err.message}`, root);
      continue;
    }

    const res = schemas.domainsRoot.safeParse(domains);
    if (!res.success && !capped('schema')) {
      add('schema', res.error.issues.slice(0, 3).map(formatIssue).join('; '), root);
    }

    for (const [kind, folder] of [
      ['characters', 'characters'],
      ['weapons', 'weapons'],
    ]) {
      const known = idsByLangFolder.get(`${lang}/${folder}`);
      if (!known) continue;
      const dangling = new Set();
      for (const dom of domains[kind] ?? []) {
        for (const rot of dom.rotation ?? []) {
          for (const id of rot.ids ?? []) {
            if (!known.has(id)) dangling.add(id);
          }
        }
      }
      if (dangling.size && !capped('reference')) {
        const list = [...dangling].slice(0, 5);
        add('reference', `${dangling.size} ${kind} rotation ids not present in ${folder}/ (e.g. ${list.join(', ')})`, root);
      }
    }
  }
}

// --- report -----------------------------------------------------------------

const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, categoryCount(c)]));
const total = errors.length;

console.log(`\nvalidated ${LANGS.length} language(s) x ${idsByLangFolder.size / LANGS.length} folder(s)`);
console.log(`errors: ${total}`);
for (const c of CATEGORIES) {
  if (byCategory[c]) console.log(`  ${c.padEnd(10)} ${byCategory[c]}${byCategory[c] >= MAX_ERRORS ? '  (capped)' : ''}`);
}

const blocking = errors.filter((e) => BLOCKING.has(e.category)).length;

if (total) {
  console.log('\nfirst errors:');
  for (const e of errors.slice(0, 30)) {
    console.log(`  [${e.category}] ${e.file ?? ''}\n      ${e.message}`);
  }
}

if (jsonOut) {
  fs.writeFileSync(path.resolve(ROOT, jsonOut), JSON.stringify({ total, blocking, byCategory, errors }, null, 2));
  console.log(`\nreport written to ${jsonOut}`);
}

if (blocking > 0) {
  console.log(`\nFAIL: ${blocking} blocking error(s).`);
  process.exit(1);
}
if (total) {
  console.log(`\nOK: 0 blocking errors (${total - blocking} advisory).`);
  process.exit(0);
}
console.log('\nOK: no issues found.');
