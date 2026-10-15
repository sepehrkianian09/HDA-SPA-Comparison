# SPA vs HDA experiment

This repository implements the same small e-commerce journey twice over one Node HTTP backend:

- `/spa/` uses a browser-rendered UI and the JSON API.
- `/hda/` uses server-rendered HTML forms and links.
- `/api/products`, `/api/cart`, and `/api/checkout` contain shared business operations.

## Run and verify

```sh
npm start
npm test
npm run test:e2e
npm run metrics
```

Open `http://127.0.0.1:3000/spa/` and `/hda/`. `reports/metrics.json` records reproducible source-size data. If Lighthouse and Playwright are installed, run Lighthouse against both routes and add browser journeys for product search, add-to-cart, and checkout; the included API journey is dependency-free so the baseline is runnable in a fresh environment.

After generating both Lighthouse reports, run `npm run compare` to create `reports/lighthouse-comparison.html`. The table compares category scores and the overall metrics object, including `observed*` metrics, with green/red highlighting for the better/worse result.
