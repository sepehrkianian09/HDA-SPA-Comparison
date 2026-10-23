const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { ROOT, RESULTS_DIR, UI_PAGES, UI_PORT } = require('./config');
const { collectLighthouse } = require('./lighthouse');
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function collect() {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const pages = process.env.UI_TARGET ? [process.env.UI_TARGET] : UI_PAGES;
  const server = spawn(process.execPath, ['step-6-applications/backend/server.js'], { cwd: ROOT, env: { ...process.env, PORT: String(UI_PORT) }, stdio: 'ignore' });
  await wait(500);
  const runs = Number(process.env.UI_RUNS || 3);
  const report = pages.map(page => {
    const results = Array.from({ length: runs }, (_, index) => collectLighthouse({ root: ROOT, port: UI_PORT, page, output: `${RESULTS_DIR}/${page}-lighthouse-run-${index + 1}.json` }));
    const collected = results.filter(result => result.status === 'collected');
    if (!collected.length) return { page, status: 'unavailable', runs: results, reason: results[0]?.reason || 'No Lighthouse runs collected' };
    const median = values => { const sorted = values.slice().sort((a, b) => a - b); return Number(sorted[Math.floor(sorted.length / 2)].toFixed(2)); };
    const metrics = Object.fromEntries(Object.keys(collected[0].metrics).map(name => { const value = median(collected.map(result => result.metrics[name].value)); return [name, { value, displayValue: name === 'cls' ? String(value) : `${value.toFixed(2)} ms` }]; }));
    return { page, status: 'collected', runs: results, metrics };
  });
  try { server.kill(); } catch (error) { console.warn(`Could not stop local server: ${error.message}`); }
  const output = { generatedAt: new Date().toISOString(), pages: report };
  fs.writeFileSync(`${RESULTS_DIR}/ui-metrics.json`, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}
collect().catch(error => { console.error(error); process.exitCode = 1; });
