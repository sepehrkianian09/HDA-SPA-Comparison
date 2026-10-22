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
  const report = pages.map(page => collectLighthouse({ root: ROOT, port: UI_PORT, page, output: `${RESULTS_DIR}/${page}-lighthouse.json` }));
  server.kill();
  const output = { generatedAt: new Date().toISOString(), pages: report };
  fs.writeFileSync(`${RESULTS_DIR}/ui-metrics.json`, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}
collect().catch(error => { console.error(error); process.exitCode = 1; });
