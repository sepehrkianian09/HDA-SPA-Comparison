const products = [
  { id: 'lamp', name: 'Focus Lamp', category: 'lighting', price: 49, description: 'Warm adjustable light for focused work.' },
  { id: 'stand', name: 'Aluminum Desk Stand', category: 'desk', price: 35, description: 'Raises a laptop to a comfortable viewing height.' },
  { id: 'mat', name: 'Wool Desk Mat', category: 'desk', price: 29, description: 'A quiet, soft surface for keyboard and mouse.' }
];
const searchProducts = (query = '') => { const q = String(query ?? '').trim().toLowerCase(); return products.filter(({ name, category }) => `${name} ${category}`.toLowerCase().includes(q)); };
const findProduct = id => products.find(product => product.id === id);
module.exports = { products, findProduct, searchProducts };
