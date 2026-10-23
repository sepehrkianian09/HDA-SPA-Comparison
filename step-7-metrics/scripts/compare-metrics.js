const fs = require('node:fs');
const { RESULTS_DIR } = require('./config');
const readJson = name => JSON.parse(fs.readFileSync(`${RESULTS_DIR}/${name}`, 'utf8'));
const maintainability = fs.existsSync(`${RESULTS_DIR}/maintainability.json`) ? readJson('maintainability.json') : { rows: [], coverage: { status: 'unavailable', reason: 'No maintainability results collected.' } };
const ui = fs.existsSync(`${RESULTS_DIR}/ui-metrics.json`) ? readJson('ui-metrics.json') : { pages: [] };
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const sourceRows = maintainability.rows.map(row => `<tr><td>${escape(row.file)}</td><td>${row.lines}</td><td>${row.moduleSizeBytes}</td><td>${row.duplication.percentage}%</td><td>${row.approximateCyclomaticComplexity}</td></tr>`).join('');
const coverage = maintainability.coverage?.status === 'collected' ? `${maintainability.coverage.linePercentage}% / ${maintainability.coverage.branchPercentage}% / ${maintainability.coverage.functionPercentage}%` : escape(maintainability.coverage?.reason || 'Unavailable');
const pageByName = Object.fromEntries(ui.pages.map(page => [page.page, page]));
const uiMetricDefinitions = [['fcp', 'First Contentful Paint'], ['lcp', 'Largest Contentful Paint'], ['tti', 'Time to Interactive'], ['tbt', 'Total Blocking Time'], ['cls', 'Cumulative Layout Shift']];
const metricValue = (page, name) => {
  const metric = page?.metrics?.[name];
  if (metric && typeof metric === 'object') return { value: Number(metric.value), display: metric.displayValue };
  if (typeof metric === 'number') return { value: metric, display: String(metric) };
  return null;
};
const uiRows = uiMetricDefinitions.map(([name, label]) => {
  const spa = metricValue(pageByName.spa, name);
  const hda = metricValue(pageByName.hda, name);
  const comparable = spa && hda && Number.isFinite(spa.value) && Number.isFinite(hda.value);
  const spaClass = comparable ? (spa.value < hda.value ? 'better' : spa.value > hda.value ? 'worse' : 'tie') : '';
  const hdaClass = comparable ? (hda.value < spa.value ? 'better' : hda.value > spa.value ? 'worse' : 'tie') : '';
  return `<tr><th scope="row">${label}</th><td class="${spaClass}">${escape(spa?.display || 'Unavailable')}</td><td class="${hdaClass}">${escape(hda?.display || 'Unavailable')}</td></tr>`;
}).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SPA vs HDA metrics</title><style>body{font:16px system-ui;max-width:1000px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;margin:1rem 0;width:100%}th,td{border:1px solid #ccc;padding:.5rem;text-align:left}th{background:#f3f3f3}.better{background:#d9f7df;color:#146c2e;font-weight:600}.worse{background:#ffdede;color:#a61b1b;font-weight:600}.tie{background:#fff4cc;color:#725b00;font-weight:600}.legend{font-size:.9rem}.swatch{display:inline-block;padding:.15rem .4rem;margin-right:.5rem}.green{background:#d9f7df;color:#146c2e}.red{background:#ffdede;color:#a61b1b}</style></head>
<body><h1>SPA vs HDA experiment</h1><h2>Maintainability</h2><table><tr><th>Artifact</th><th>Lines</th><th>Module size (bytes)</th><th>Duplication</th><th>Approx. complexity</th></tr>${sourceRows || '<tr><td colspan="5">No maintainability results collected.</td></tr>'}</table><p>Backend test coverage (line / branch / function): ${coverage}</p><h2>UI performance (median of three runs)</h2><p class="legend"><span class="swatch green">Better</span><span class="swatch red">Worse</span>Lower values are better for all metrics.</p><table><tr><th>Metric</th><th>SPA</th><th>HDA</th></tr>${uiRows}</table></body></html>`;
fs.writeFileSync(`${RESULTS_DIR}/comparison.html`, html);
console.log(`Wrote ${RESULTS_DIR}/comparison.html`);
