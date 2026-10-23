const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
function collectLighthouse({ root, port, page, output }) {
  const result = spawnSync('npx', ['--yes', 'lighthouse', `http://127.0.0.1:${port}/${page}`, '--output=json', `--output-path=${output}`, '--chrome-flags=--headless --no-sandbox'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 || !fs.existsSync(output)) return { page, status: 'unavailable', reason: result.stderr.trim() || 'Lighthouse produced no report' };
  const audits = JSON.parse(fs.readFileSync(output, 'utf8')).audits;
  const metric = id => ({ value: audits[id].numericValue, displayValue: audits[id].displayValue });
  return { page, status: 'collected', metrics: { fcp: metric('first-contentful-paint'), lcp: metric('largest-contentful-paint'), tti: metric('interactive'), tbt: metric('total-blocking-time'), cls: metric('cumulative-layout-shift') } };
}
module.exports = { collectLighthouse };
