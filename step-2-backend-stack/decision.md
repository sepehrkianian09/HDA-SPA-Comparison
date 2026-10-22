# Backend stack decision

Node.js is shared by both variants. The experiment's execution environment does not ship an installed dependency tree, so the backend uses Node's standard `http` module while preserving the Express-compatible REST shape requested by the workflow. This keeps the experiment runnable offline; the route contract can be moved directly to Express handlers.

Endpoints: `GET /api/products`, `GET /api/products/:id`, `POST /api/cart`, and `DELETE /api/cart/:id`.
