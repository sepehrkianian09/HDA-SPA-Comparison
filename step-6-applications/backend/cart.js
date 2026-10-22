function createCart() {
  const items = new Map();
  const entries = () => [...items.entries()].map(([product, quantity]) => ({ product, quantity }));
  const summary = () => entries().reduce((result, { product, quantity }) => ({ items: result.items + quantity, total: result.total + product.price * quantity }), { items: 0, total: 0 });
  return { add(product, quantity) { items.set(product, (items.get(product) || 0) + quantity); }, remove(product) { return items.delete(product); }, clear() { items.clear(); }, entries, summary, snapshot() { return { ...summary(), entries: entries() }; } };
}
module.exports = { createCart };
