# Common scenarios

1. **Browse and search:** load the catalog, type `stand`, and verify the result list narrows to the desk stand.
2. **Add to cart:** add a product, verify the cart count changes, and verify the total.
3. **Remove from cart:** remove the product and verify an empty cart.

The SPA performs state transitions in React and fetches JSON. The HDA submits forms to the server and swaps returned HTML fragments with htmx, making the server response the source of rendered state.
