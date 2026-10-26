# Experiment Workflow: Comparing SPA and HDA Web Applications

- For each step, create a separate folder in the project, and put the leading materials inside.

## 1. Defining Metrics
- **Code Maintainability:**
  - example metrics: Cyclomatic complexity, code duplication, test coverage, and module size.
  - Tool: A simple tool that can evaluate the desired metrics. And can be used for both JS and HTML files. You can use different tool for evaluating JS and HTML files.
- **UI:**
  - First Contentful Paint, Largest Contentful Paint, Time to Interactive, Total Blocking Time, and Cumulative Layout Shift.
  - Tool: Lighthouse CLI.
- **Testing:**
  - Unit-test coverage.
  - End-to-end tests using Playwright.

## 2. Selecting a Backend Stack
- **Consistency:** develop separate backend for SPA and HDA. However, the logic code must be the same, ensuring performance consistency.
- **Library:**
  - **Node.js:** Express leveraging RESTful or GraphQL endpoints.
- **Features:**
  - Logging, authentication, data validation, and comprehensive testing support.

## 3. Select Frontend Stacks
- **HDA:** htmx and server-side templating with frameworks like EJS
- **SPA:** React.js 

## 4. Domain of Focus
- **General Algorithm:** scroll through HDA stack library (htmx), find out about its common use cases. Then, design a domain with requirements where the HDA library can be used. 
- **Recommendation:** E-commerce system or another very dynamic, stateful application.
- **An Example Set of Use Cases:**
  - Product listing and search.
  - Cart management and checkout process.
  - User account and order management.

### 4.1. Requirements Engineering Analysis
- **Points to Consider:** The requirements should be in a way that the HDA library can be usable.
- **Example Functional Requirements:**
  - User authentication (login/signup).
  - Browsing and searching for products/items.
  - Managing shopping cart, checkout workflow, and order tracking.
- **Example Non-Functional Requirements:**
  - Performance, accessibility, and security standards.
  - Maintainability and scalability.

## 5. Creating Scenarios
- **General Algorithm:** Develop Common User Scenarios based on the documented domain and requirements engineering analysis
- **Example User Journeys:**
  - Browsing products and details.
  - Adding/removing items from a shopping cart.
  - Executing a seamless checkout process.
- **Paradigm Considerations:**
  - SPA: Evaluate client-side state management, dynamic content changes, and initial load performance.
  - HDA: Assess server-driven UI generation, hypermedia state transitions, and progressive enhancement.


## 6. Developing Two Separate Applications
- **Testing:** 
  - Implement both unit tests for backend logic and Playwright tests for frontend interactions.


## 7. Gathering Metrics
- **Tools & Methods:**
  - Develop a script for gathering UI performance metrics.
  - Develop a script for gathering maintainability metrics.
  - For each set of metrics, develop a script that creates a comparison table from the gathered metrics.
  - Combine unit and E2E test results to gauge overall workability.

## 8. Refactoring
- **Algorithm**: just refactor. But refactor any code, including codes related to metrics.
- remember to not change the existing behavior.
