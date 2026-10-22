# Experiment report

## Functional results

- Backend unit tests: **3 passed, 0 failed**.
- Frontend smoke checks: **SPA and HDA served successfully**.
- Playwright scenarios are defined in `step-6-applications/e2e/shop.spec.js` but require a browser installation to execute.

## Maintainability snapshot

See `maintainability.json` and `comparison.html`. The source scan reports approximate complexity; Fallow was invoked but could not analyze this dependency-free layout and exited with status 1.

## UI performance

Lighthouse CLI was installed and invoked for both pages, but no Chrome/Chromium executable is installed in the environment (`CHROME_PATH` is unset). Therefore FCP, LCP, TTI, TBT, and CLS are not reported rather than fabricated.
