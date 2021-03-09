const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { deepMerge } = require('./utils');

const DATA_PATH = path.join(__dirname, '..', '..', 'data');
const GENERATED_PATH = path.join(__dirname, '..', '..', 'src', 'generated');

const log = console.log;

async function generateArtifacts(lang) {
  const artifacts = [];
  const artifactsPath = path.join(
    DATA_PATH,
    lang === 'english' ? 'general' : lang,
    'artifacts'
  );
  fs.readdirSync(artifactsPath).forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const data = require(path.join(artifactsPath, filename));
    const originalData = require(path.join(
      DATA_PATH,
      'general',
      'artifacts',
      filename
    ));

    const fmtData = deepMerge(originalData, data);
    artifacts.push(fmtData);
  });

  fs.writeFileSync(
    path.join(GENERATED_PATH, lang, `artifacts.json`),
    JSON.stringify(artifacts, null, '\t')
  );

  log(chalk.green(`[✓] artifacts.json created`));

  return artifacts;
}

exports.default = generateArtifacts;
