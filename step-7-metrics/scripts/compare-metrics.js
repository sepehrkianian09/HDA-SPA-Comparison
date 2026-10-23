const fs = require('node:fs');
const { RESULTS_DIR } = require('./config');
const readJson = name => JSON.parse(fs.readFileSync(`${RESULTS_DIR}/${name}`, 'utf8'));
const maintainability = readJson('maintainability.json');
const ui = fs.existsSync(`${RESULTS_DIR}/ui-metrics.json`) ? readJson('ui-metrics.json') : { pages: [] };
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const sourceRows = maintainability.rows.map(row => `<tr><td>${escape(row.file)}</td><td>${row.lines}</td><td>${row.moduleSizeBytes}</td><td>${row.duplication.percentage}%</td><td>${row.approximateCyclomaticComplexity}</td></tr>`).join('');
const coverage = maintainability.coverage?.status === 'collected' ? `${maintainability.coverage.linePercentage}% / ${maintainability.coverage.branchPercentage}% / ${maintainability.coverage.functionPercentage}%` : escape(maintainability.coverage?.reason || 'Unavailable');
const uiRows = ui.pages.map(page => `<tr><td>${escape(page.page)}</td><td>${escape(page.status)}</td><td>${page.metrics ? Object.entries(page.metrics).map(([name, metric]) => `${name}: ${escape(metric.displayValue || metric)}`).join('<br>') : escape(page.reason)}</td></tr>`).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SPA vs HDA metrics</title><style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;margin:1rem 0;width:100%}th,td{border:1px solid #ccc;padding:.5rem;text-align:left}th{background:#f3f3f3}</style></head>
<body><h1>SPA vs HDA experiment</h1><h2>Maintainability</h2><table><tr><th>Artifact</th><th>Lines</th><th>Module size (bytes)</th><th>Duplication</th><th>Approx. complexity</th></tr>${sourceRows}</table><p>Backend test coverage (line / branch / function): ${coverage}</p><h2>UI performance (median of three runs)</h2><table><tr><th>Page</th><th>Status</th><th>FCP / LCP / TTI / TBT / CLS</th></tr>${uiRows || '<tr><td colspan="3">No UI metrics collected.</td></tr>'}</table></body></html>`;
fs.writeFileSync(`${RESULTS_DIR}/comparison.html`, html);
console.log(`Wrote ${RESULTS_DIR}/comparison.html`);
