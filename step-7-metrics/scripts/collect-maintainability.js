const fs = require('node:fs');
const { execFileSync, spawnSync } = require('node:child_process');
const { ROOT, RESULTS_DIR } = require('./config');
const { sourceMetrics } = require('./file-metrics');

const targets = ['step-6-applications/backend', 'step-6-applications/e2e', 'step-3-frontend-stacks/spa', 'step-3-frontend-stacks/hda'];
const filesIn = directory => fs.readdirSync(`${ROOT}/${directory}`, { withFileTypes: true }).filter(entry => entry.isFile() && /\.(js|html)$/.test(entry.name)).map(entry => `${directory}/${entry.name}`);
function collectFallow() { try { return { status: 'collected', output: execFileSync('npx', ['--yes', 'fallow', ...targets], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() }; } catch (error) { return { status: 'unavailable', reason: `fallow exited with status ${error.status}` }; } }
function collectCoverage() {
  const result = spawnSync(process.execPath, ['--test', '--experimental-test-coverage', 'step-6-applications/backend/*.test.js'], { cwd: ROOT, shell: true, encoding: 'utf8' });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const match = output.match(/# all files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
  return result.status === 0 && match
    ? { status: 'collected', linePercentage: Number(match[1]), branchPercentage: Number(match[2]), functionPercentage: Number(match[3]) }
    : { status: 'unavailable', reason: output.trim() || `node exited with status ${result.status}` };
}

const rows = targets.flatMap(filesIn).map(file => sourceMetrics(`${ROOT}/${file}`, file));
const report = { generatedAt: new Date().toISOString(), rows, coverage: collectCoverage(), fallow: collectFallow() };
fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(`${RESULTS_DIR}/maintainability.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
