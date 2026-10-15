import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const reportsDir = process.argv[2] ?? "reports";
const outputPath = process.argv[3] ?? path.join(reportsDir, "lighthouse-comparison.html");
const reportPaths = {
  spa: path.join(reportsDir, "lighthouse-spa.json"),
  hda: path.join(reportsDir, "lighthouse-hda.json"),
};

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const loadReport = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));

const getOverallMetrics = (report) => {
  const items = report.audits?.metrics?.details?.items?.filter((entry) => entry && typeof entry === "object") ?? [];
  const item = Object.assign({}, ...items);

  if (!Object.keys(item).length) throw new Error("Could not find audits.metrics.details.items in Lighthouse report");
  return item;
};

const formatMetricName = (name) => name
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/^./, (character) => character.toUpperCase());

const formatValue = (value) => typeof value === "number"
  ? Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 3 })
  : value;

const compareClass = (spaValue, hdaValue, higherIsBetter = false) => {
  if (typeof spaValue !== "number" || typeof hdaValue !== "number" || spaValue === hdaValue) {
    return ["", ""];
  }
  const spaWins = higherIsBetter ? spaValue > hdaValue : spaValue < hdaValue;
  return spaWins ? ["better", "worse"] : ["worse", "better"];
};

const isTraceTimestamp = (name) => name.endsWith("Ts");

const metricRows = (spa, hda) => {
  const names = [...new Set([...Object.keys(spa), ...Object.keys(hda)])];
  return names.map((name) => {
    const [spaClass, hdaClass] = isTraceTimestamp(name) ? ["", ""] : compareClass(spa[name], hda[name]);
    return `<tr><th scope="row">${escapeHtml(formatMetricName(name))}</th>`
      + `<td class="${spaClass}">${escapeHtml(formatValue(spa[name] ?? "—"))}</td>`
      + `<td class="${hdaClass}">${escapeHtml(formatValue(hda[name] ?? "—"))}</td></tr>`;
  }).join("\n");
};

const categoryRows = (spa, hda) => {
  const names = [...new Set([...Object.keys(spa.categories ?? {}), ...Object.keys(hda.categories ?? {})])];
  return names.map((name) => {
    const spaValue = spa.categories?.[name]?.score;
    const hdaValue = hda.categories?.[name]?.score;
    const [spaClass, hdaClass] = compareClass(spaValue, hdaValue, true);
    const display = (value) => typeof value === "number" ? `${Math.round(value * 100)}%` : "—";
    return `<tr><th scope="row">${escapeHtml(formatMetricName(name))}</th>`
      + `<td class="${spaClass}">${display(spaValue)}</td><td class="${hdaClass}">${display(hdaValue)}</td></tr>`;
  }).join("\n");
};

const [spa, hda] = await Promise.all([loadReport(reportPaths.spa), loadReport(reportPaths.hda)]);
const spaMetrics = getOverallMetrics(spa);
const hdaMetrics = getOverallMetrics(hda);
const generatedAt = new Date().toISOString();

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lighthouse SPA vs HDA comparison</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, sans-serif; }
    body { color: #17202a; margin: 2rem auto; max-width: 60rem; padding: 0 1rem; }
    h1 { margin-bottom: .25rem; }
    p { color: #566573; }
    table { border-collapse: collapse; margin: 1.5rem 0 2rem; width: 100%; }
    caption { font-size: 1.2rem; font-weight: 700; padding: .75rem 0; text-align: left; }
    th, td { border-bottom: 1px solid #d5d8dc; padding: .6rem .75rem; text-align: right; }
    th:first-child { text-align: left; }
    thead th { background: #f1f3f4; position: sticky; top: 0; }
    tbody th { font-weight: 500; }
    .better { background: #d9f2df; color: #145a24; font-weight: 700; }
    .worse { background: #f8d7da; color: #842029; }
    .legend { font-size: .9rem; }
    .swatch { border-radius: .2rem; display: inline-block; height: .8rem; margin: 0 .25rem 0 .75rem; width: .8rem; }
    .green { background: #d9f2df; } .red { background: #f8d7da; }
  </style>
</head>
<body>
  <h1>Lighthouse SPA vs HDA</h1>
  <p>Generated ${escapeHtml(generatedAt)}. Values are taken from the two Lighthouse reports in <code>${escapeHtml(reportsDir)}</code>.</p>
  <p class="legend"><span class="swatch green"></span>better on that metric <span class="swatch red"></span>worse on that metric. Timing and observed values use lower-is-better; category scores use higher-is-better. Raw trace timestamps are shown without a comparison color.</p>
  <table>
    <caption>Category scores</caption>
    <thead><tr><th scope="col">Category</th><th scope="col">SPA</th><th scope="col">HDA</th></tr></thead>
    <tbody>${categoryRows(spa, hda)}</tbody>
  </table>
  <table>
    <caption>Overall metrics (including observed metrics)</caption>
    <thead><tr><th scope="col">Metric</th><th scope="col">SPA</th><th scope="col">HDA</th></tr></thead>
    <tbody>${metricRows(spaMetrics, hdaMetrics)}</tbody>
  </table>
</body>
</html>
`;

await writeFile(outputPath, html);
console.log(`Wrote ${outputPath}`);
