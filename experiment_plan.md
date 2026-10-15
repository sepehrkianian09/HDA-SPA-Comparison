# Experiment Plan: Comparing SPA and HDA Web Applications

## 1. Defining Metrics
- **Code Maintainability:**
  - Cyclomatic complexity, code duplication, test coverage, and module size.
  - Tools: SonarQube, pylint, or similar.
- **UI (Lighthouse) Metrics:**
  - First Contentful Paint, Largest Contentful Paint, Time to Interactive, Total Blocking Time, and Cumulative Layout Shift.
  - Tool: Lighthouse CLI.
- **Testing:**
  - Unit-test coverage.
  - End-to-end tests using Playwright.

## 2. Selecting a Backend Stack
- **Consistency:** Same backend for both SPA and HDA.
- **Options:**
  - **Python:** Flask with REST API endpoints.
  - **Node.js:** Express leveraging RESTful or GraphQL endpoints.
- **Features:**
  - Logging, authentication, data validation, and comprehensive testing support.

## 3. Domain of Focus
- **Recommendation:** E-commerce system or another very dynamic, stateful application.
- **Use Cases:**
  - Product listing and search.
  - Cart management and checkout process.
  - User account and order management.

## 4. Requirements Engineering Analysis
- **Functional Requirements:**
  - User authentication (login/signup).
  - Browsing and searching for products/items.
  - Managing shopping cart, checkout workflow, and order tracking.
- **Non-Functional Requirements:**
  - Performance, accessibility, and security standards.
  - Maintainability and scalability.

## 5. Creating Scenarios
- **User Journeys:**
  - Browsing products and details.
  - Adding/removing items from a shopping cart.
  - Executing a seamless checkout process.
- **Paradigm Considerations:**
  - SPA: Evaluate client-side state management, dynamic content changes, and initial load performance.
  - HDA: Assess server-driven UI generation, hypermedia state transitions, and progressive enhancement.

## 6. Developing Two Separate Applications
- **SPA Version:**
  - Use frameworks such as Next.js, React, or Angular.
  - Emphasize client-side interactivity, state management, and dynamic routing.
- **HDA Version:**
  - Use server-side templating with frameworks like Flask (Jinja2) or Express (EJS).
  - Enhance with hypermedia controls using libraries like htmx.
- **Shared Backend:** 
  - Both applications will interact with the same API endpoints to ensure consistency in business logic and data operations.
- **Testing:** 
  - Implement both unit tests for backend logic and Playwright tests for frontend interactions.

## 7. Gathering Metrics
- **Tools & Methods:**
  - Use Lighthouse CLI for UI performance.
  - Run static code analysis (SonarQube/pylint) for maintainability.
  - Combine unit and E2E test results to gauge overall workability.
- **Reporting:**
  - Compile metrics into dashboards or tables for side-by-side comparison.
  - Analyze and document trade-offs between SPA and HDA paradigms.

## Next Steps
- Finalize detailed project timeline and sprint breakdown.
- Set up the shared backend API.
- Begin prototyping the two separate frontend applications.
- Establish the testing and metric collection frameworks.
