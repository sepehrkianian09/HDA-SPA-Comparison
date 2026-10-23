# Metrics definition

| Dimension | Measures | Collection method |
|---|---|---|
| Maintainability | Cyclomatic complexity, normalized line duplication, source lines, and module size in bytes | Source scan for JS/HTML; Fallow CLI where available |
| Coverage | Backend line, branch, and function coverage | Node's built-in test coverage |
| UI performance | FCP, LCP, TTI, TBT, CLS | Lighthouse CLI, three runs per frontend, median reported |
| Workability | API unit tests and browser journeys | `node --test` and Playwright |

The comparison is controlled by using the same backend, product data, browser viewport, user journeys, and local host for both frontends. Performance numbers are directional because this is a local development build rather than a production deployment.
