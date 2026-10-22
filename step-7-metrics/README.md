# Gathering and reporting metrics

Run `npm test`, `npm run test:e2e`, `npm run metrics`, `npm run metrics:ui`, then `npm run metrics:compare`. Use `npm run metrics:ui:spa` or `npm run metrics:ui:hda` to collect one page. The UI collector starts the local server, invokes Lighthouse, and writes `step-7-metrics/results/ui-metrics.json` plus page-specific Lighthouse JSON files. If Chrome/Chromium is unavailable, it records an `unavailable` result with the command error instead of failing silently.
