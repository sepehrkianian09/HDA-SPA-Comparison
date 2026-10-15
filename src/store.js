export const products = [
  { id: "mug", name: "Ceramic Travel Mug", description: "A durable mug for daily commutes.", price: 24.9, category: "Kitchen", stock: 8 },
  { id: "lamp", name: "Desk Lamp", description: "Warm, adjustable light for focused work.", price: 49.0, category: "Home", stock: 5 },
  { id: "notebook", name: "Recycled Notebook", description: "A 120-page notebook made from recycled paper.", price: 12.5, category: "Office", stock: 20 },
  { id: "bottle", name: "Steel Water Bottle", description: "Insulated, reusable and leak resistant.", price: 31.75, category: "Outdoors", stock: 12 }
];

export function searchProducts(query = "") {
  const q = query.trim().toLowerCase();
  return products.filter(p => !q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q));
}

export function createCart() { return new Map(); }

export function addToCart(cart, id, quantity = 1) {
  const product = products.find(p => p.id === id);
  if (!product) throw new Error("Product not found");
  const next = (cart.get(id) || 0) + Number(quantity);
  if (!Number.isInteger(next) || next < 1 || next > product.stock) throw new Error("Quantity exceeds stock");
  cart.set(id, next);
  return cart;
}

export function cartSummary(cart) {
  const items = [...cart].map(([id, quantity]) => ({ product: products.find(p => p.id === id), quantity }));
  return { items, count: items.reduce((n, i) => n + i.quantity, 0), total: items.reduce((n, i) => n + i.product.price * i.quantity, 0) };
}
