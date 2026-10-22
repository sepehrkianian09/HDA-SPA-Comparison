# Domain and requirements

## Domain

Small online shop selling desk accessories. Product listing/search and cart updates provide meaningful state transitions without requiring payment or external accounts.

## Functional requirements

1. Browse products and search by name or category.
2. View price, category, and description.
3. Add a product to the cart and see the updated item count and total.
4. Remove an item from the cart.

## Non-functional requirements

- The same API and seed data must serve both frontends.
- Keyboard-accessible controls and labels are required.
- Invalid product IDs and malformed quantities must return useful 4xx responses.
- Tests must cover core API behavior and the principal browser journey.
