const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const RESULTS_DIR = path.join(ROOT, 'step-7-metrics/results');
const UI_PAGES = ['spa', 'hda'];
const UI_PORT = Number(process.env.PORT || 3000);
module.exports = { ROOT, RESULTS_DIR, UI_PAGES, UI_PORT };
