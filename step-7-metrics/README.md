# Gathering and reporting metrics

Run `npm test`, then `npm run metrics`, then `npm run metrics:compare`. Lighthouse can be run against `/spa` and `/hda` with `npx lighthouse http://127.0.0.1:3000/spa --output=json --output-path=step-7-metrics/results/spa-lighthouse.json` and the corresponding HDA URL. The maintainability script records a lightweight source-size/branch signal and invokes Fallow when available; the source signal is explicitly approximate because the experiment has no dependency install or build pipeline.
