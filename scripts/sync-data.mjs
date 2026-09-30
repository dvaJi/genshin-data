#!/usr/bin/env node
/**
 * Syncs format-genshindata's `readable/<lang>/` output into this repo's `src/data/<lang>/`.
 *
 * SAFETY RULES (learned the hard way — do not remove these):
 *
 *  1. NEVER delete based on absence alone. A partial upstream run (e.g. `LANG_TOFORMAT=EN`
 *     when the repo holds 15 languages, or a source folder that generated 0 files because of a
 *     broken mapping) looks exactly like "these files were deleted upstream". Acting on that
 *     wiped 32,712 files in one pass. Absence is only meaningful if the source run COMPLETED.
 *  2. Require an explicit --prune to delete anything, and only prune folders where the source
 *     is non-empty. A folder that is empty or missing upstream is reported, never touched.
 *  3. Fail loudly if a source language folder is empty or missing.
 *
 * Usage:
 *   node scripts/sync-data.mjs --from <path-to-readable>            # add/update only (safe)
 *   node scripts/sync-data.mjs --from <path> --prune                 # also delete removed slugs
 *   node scripts/sync-data.mjs --from <path> --dry-run
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEST = path.join(ROOT, 'src', 'data');

const argv = process.argv.slice(2);
const argOf = (f) => {
  const i = argv.indexOf(f);
  return i === -1 ? undefined : argv[i + 1];
};
const SOURCE = argOf('--from');
const PRUNE = argv.includes('--prune');
const DRY = argv.includes('--dry-run');

if (!SOURCE) {
  console.error('missing --from <path-to-readable>');
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  console.error(`source not found: ${SOURCE}`);
  process.exit(1);
}

const md5 = (f) => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');

/**
 * The source may be a live pipeline output directory that a running process is rewriting
 * (each language does clearContent() first, so files vanish and reappear mid-scan). Treat a
 * vanished file as "cannot compare" and skip it rather than crashing the sync.
 */
const md5Safe = (f) => {
  try {
    return md5(f);
  } catch {
    return null;
  }
};

const stats = { added: 0, updated: 0, unchanged: 0, removed: 0, skippedEmptyFolder: 0, skippedMissingLang: 0, vanished: 0 };
const skipFolders = new Set();
const missingLangs = [];

const copy = (from, to) => {
  if (DRY) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};

const langDirs = fs.readdirSync(SOURCE, { withFileTypes: true }).filter((e) => e.isDirectory());

if (langDirs.length === 0) {
  console.error(`ABORT: no language directories under ${SOURCE}. Refusing to sync an empty source.`);
  process.exit(1);
}

for (const langEntry of langDirs) {
  const lang = langEntry.name;
  const srcLang = path.join(SOURCE, lang);
  const dstLang = path.join(DEST, lang);

  // RULE 3: a language with no output at all means the run never covered it.
  const hasAnyFile = fs
    .readdirSync(srcLang, { withFileTypes: true })
    .some((e) => e.isDirectory() || e.name.endsWith('.json'));
  if (!hasAnyFile) {
    missingLangs.push(lang);
    continue;
  }
  if (!fs.existsSync(dstLang)) {
    console.log(`[warn] destination language "${lang}" does not exist; creating it`);
    if (!DRY) fs.mkdirSync(dstLang, { recursive: true });
  }

  for (const item of fs.readdirSync(srcLang, { withFileTypes: true })) {
    const s = path.join(srcLang, item.name);
    const d = path.join(dstLang, item.name);

    if (!item.isDirectory()) {
      if (!item.name.endsWith('.json')) continue;
      if (!fs.existsSync(s)) { stats.vanished++; continue; }
      if (!fs.existsSync(d)) { copy(s, d); stats.added++; }
      else {
        const hs = md5Safe(s);
        const hd = md5Safe(d);
        if (hs === null) { stats.vanished++; continue; }
        if (hd === null) { copy(s, d); stats.updated++; }
        else if (hs !== hd) { copy(s, d); stats.updated++; }
        else stats.unchanged++;
      }
      continue;
    }

    const srcFiles = fs.readdirSync(s).filter((f) => f.endsWith('.json'));

    // RULE 2: an empty source folder is a broken run, not a mass deletion.
    if (srcFiles.length === 0) {
      stats.skippedEmptyFolder++;
      skipFolders.add(`${lang}/${item.name}`);
      continue;
    }

    const upstream = new Set();
    for (const f of srcFiles) {
      const sf = path.join(s, f);
      if (!fs.existsSync(sf)) { stats.vanished++; continue; }
      upstream.add(f);
      const t = path.join(d, f);
      if (!fs.existsSync(t)) { copy(sf, t); stats.added++; continue; }
      const hs = md5Safe(sf);
      const hd = md5Safe(t);
      if (hs === null) { stats.vanished++; continue; }
      if (hd === null) { copy(sf, t); stats.updated++; continue; }
      if (hs !== hd) { copy(sf, t); stats.updated++; }
      else stats.unchanged++;
    }

    if (!fs.existsSync(d) && !DRY) fs.mkdirSync(d, { recursive: true });
    for (const old of fs.readdirSync(d).filter((f) => f.endsWith('.json'))) {
      if (upstream.has(old)) continue;
      if (!PRUNE) { stats.skippedEmptyFolder++; continue; }
      if (!DRY) fs.rmSync(path.join(d, old));
      stats.removed++;
    }
  }
}

console.log(`\nsource : ${SOURCE}`);
console.log(`dry-run: ${DRY}`);
console.log(`added=${stats.added} updated=${stats.updated} unchanged=${stats.unchanged} removed=${stats.removed}`);
if (stats.vanished) console.log(`source files vanished mid-scan (pipeline running?): ${stats.vanished}`);
if (skipFolders.size) console.log(`skipped folders (left untouched): ${[...skipFolders].join(', ')}`);
if (missingLangs.length) console.log(`languages with NO output (skipped): ${missingLangs.join(', ')}`);

if (!PRUNE && stats.removed === 0) console.log('\nnote: pass --prune to also delete slugs absent from the source.');
