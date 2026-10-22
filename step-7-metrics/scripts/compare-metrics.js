const fs = require('node:fs');
const { RESULTS_DIR } = require('./config');
const readJson = name => JSON.parse(fs.readFileSync(`${RESULTS_DIR}/${name}`, 'utf8'));
const maintainability = readJson('maintainability.json');
const ui = fs.existsSync(`${RESULTS_DIR}/ui-metrics.json`) ? readJson('ui-metrics.json') : { pages: [] };
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const sourceRows = maintainability.rows.map(row => `<tr><td>${escape(row.file)}</td><td>${row.lines}</td><td>${row.approximateCyclomaticComplexity}</td></tr>`).join('');
const uiRows = ui.pages.map(page => `<tr><td>${escape(page.page)}</td><td>${escape(page.status)}</td><td>${page.metrics ? escape(JSON.stringify(page.metrics)) : escape(page.reason)}</td></tr>`).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SPA vs HDA metrics</title><style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;margin:1rem 0;width:100%}th,td{border:1px solid #ccc;padding:.5rem;text-align:left}th{background:#f3f3f3}</style></head>
<body><h1>SPA vs HDA experiment</h1><h2>Maintainability</h2><table><tr><th>Artifact</th><th>Lines</th><th>Approx. complexity</th></tr>${sourceRows}</table><h2>UI performance</h2><table><tr><th>Page</th><th>Status</th><th>Metrics or reason</th></tr>${uiRows || '<tr><td colspan="3">No UI metrics collected.</td></tr>'}</table></body></html>`;
fs.writeFileSync(`${RESULTS_DIR}/comparison.html`, html);
console.log(`Wrote ${RESULTS_DIR}/comparison.html`);
