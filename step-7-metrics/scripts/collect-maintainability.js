const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { ROOT, RESULTS_DIR } = require('./config');
const { sourceMetrics } = require('./file-metrics');

const targets = ['step-6-applications/backend', 'step-6-applications/e2e', 'step-3-frontend-stacks/spa', 'step-3-frontend-stacks/hda'];
const filesIn = directory => fs.readdirSync(`${ROOT}/${directory}`, { withFileTypes: true }).filter(entry => entry.isFile() && /\.(js|html)$/.test(entry.name)).map(entry => `${directory}/${entry.name}`);
function collectFallow() { try { return { status: 'collected', output: execFileSync('npx', ['--yes', 'fallow', ...targets], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() }; } catch (error) { return { status: 'unavailable', reason: `fallow exited with status ${error.status}` }; } }

const rows = targets.flatMap(filesIn).map(file => sourceMetrics(`${ROOT}/${file}`, file));
const report = { generatedAt: new Date().toISOString(), rows, fallow: collectFallow() };
fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(`${RESULTS_DIR}/maintainability.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
