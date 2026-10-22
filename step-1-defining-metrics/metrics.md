# Metrics definition

| Dimension | Measures | Collection method |
|---|---|---|
| Maintainability | Cyclomatic complexity, duplication, coverage, module size | Fallow CLI where available; Node test coverage for backend |
| UI performance | FCP, LCP, TTI, TBT, CLS | Lighthouse CLI, three runs per frontend, median reported |
| Workability | API unit tests and browser journeys | `node --test` and Playwright |

The comparison is controlled by using the same backend, product data, browser viewport, user journeys, and local host for both frontends. Performance numbers are directional because this is a local development build rather than a production deployment.
