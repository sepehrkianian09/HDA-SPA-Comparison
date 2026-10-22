const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const resultsDir = path.join(root, 'step-7-metrics/results');
const pages = process.env.UI_TARGET ? [process.env.UI_TARGET] : ['spa', 'hda'];
const port = Number(process.env.PORT || 3000);

function wait(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
function runLighthouse(page) {
  const output = path.join(resultsDir, `${page}-lighthouse.json`);
  const url = `http://127.0.0.1:${port}/${page}`;
  const result = spawnSync('npx', ['--yes', 'lighthouse', url, '--output=json', `--output-path=${output}`, '--chrome-flags=--headless --no-sandbox'], { cwd: root, encoding: 'utf8' });
  if (result.status === 0 && fs.existsSync(output)) {
    const audits = JSON.parse(fs.readFileSync(output, 'utf8')).audits;
    return { page, status: 'collected', metrics: { fcp: audits['first-contentful-paint'].displayValue, lcp: audits['largest-contentful-paint'].displayValue, tti: audits.interactive.displayValue, tbt: audits['total-blocking-time'].displayValue, cls: audits['cumulative-layout-shift'].displayValue } };
  }
  return { page, status: 'unavailable', reason: result.stderr.trim() || 'Lighthouse failed to produce a report' };
}

async function main() {
  fs.mkdirSync(resultsDir, { recursive: true });
  const server = spawn(process.execPath, ['step-6-applications/backend/server.js'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  await wait(500);
  const report = pages.map(runLighthouse);
  server.kill();
  const output = { generatedAt: new Date().toISOString(), pages: report };
  fs.writeFileSync(path.join(resultsDir, 'ui-metrics.json'), JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
