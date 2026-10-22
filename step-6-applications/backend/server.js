const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const products = [
  { id: 'lamp', name: 'Focus Lamp', category: 'lighting', price: 49, description: 'Warm adjustable light for focused work.' },
  { id: 'stand', name: 'Aluminum Desk Stand', category: 'desk', price: 35, description: 'Raises a laptop to a comfortable viewing height.' },
  { id: 'mat', name: 'Wool Desk Mat', category: 'desk', price: 29, description: 'A quiet, soft surface for keyboard and mouse.' }
];
const cart = new Map();
const root = path.resolve(__dirname, '..', '..');

function json(res, status, body) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise((resolve, reject) => { let data = ''; req.on('data', c => data += c); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('invalid JSON')); } }); }); }
function cartView() { return [...cart.entries()].map(([id, quantity]) => ({ product: products.find(p => p.id === id), quantity })); }
function cartSummary() { return { items: cartView().reduce((n, i) => n + i.quantity, 0), total: cartView().reduce((n, i) => n + i.product.price * i.quantity, 0) }; }
function productsHtml(q = '') { const found = products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())); return found.map(p => `<article class="card"><h2>${p.name}</h2><p>${p.description}</p><strong>$${p.price}</strong><form hx-post="/hda/cart" hx-target="#summary" hx-swap="innerHTML"><input type="hidden" name="productId" value="${p.id}"><button type="submit">Add to cart</button></form></article>`).join('') || '<p>No products found.</p>'; }
function cartHtml() { const s = cartSummary(); return `<p role="status">Cart: ${s.items} item(s), $${s.total}</p>${cartView().map(i => `<form hx-delete="/hda/cart/${i.product.id}" hx-target="#summary" hx-swap="innerHTML"><button>${i.product.name} × ${i.quantity} — remove</button></form>`).join('')}`; }
function serveFile(res, file) { fs.readFile(file, (err, data) => err ? res.writeHead(404).end() : res.end(data)); }
function apiPath(url) { return url.pathname.split('/').filter(Boolean); }

async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const parts = apiPath(url);
  if (parts[0] === 'api') {
    if (req.method === 'GET' && parts[1] === 'products') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      return json(res, 200, products.filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q)));
    }
    if (req.method === 'GET' && parts[1] === 'cart') return json(res, 200, { ...cartSummary(), entries: cartView() });
    if (req.method === 'POST' && parts[1] === 'cart') {
      let body; try { body = await readBody(req); } catch { return json(res, 400, { error: 'Invalid JSON' }); }
      const product = products.find(p => p.id === body.productId); const quantity = Number(body.quantity || 1);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return json(res, 400, { error: 'Product or quantity is invalid' });
      cart.set(product.id, (cart.get(product.id) || 0) + quantity); return json(res, 201, { ...cartSummary(), entries: cartView() });
    }
    if (req.method === 'DELETE' && parts[1] === 'cart' && parts[2]) { if (!cart.has(parts[2])) return json(res, 404, { error: 'Cart item not found' }); cart.delete(parts[2]); return json(res, 200, { ...cartSummary(), entries: cartView() }); }
    return json(res, 404, { error: 'Not found' });
  }
  if (url.pathname === '/hda/products') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(productsHtml(url.searchParams.get('q') || '')); }
  if (url.pathname === '/hda/cart' && req.method === 'GET') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(cartHtml()); }
  if (url.pathname === '/hda/cart' && req.method === 'POST') { let body = ''; req.on('data', c => body += c); req.on('end', () => { const params = new URLSearchParams(body); const id = params.get('productId'); if (products.some(p => p.id === id)) cart.set(id, (cart.get(id) || 0) + 1); res.writeHead(200, { 'content-type': 'text/html' }); res.end(cartHtml()); }); return; }
  if (url.pathname.startsWith('/hda/cart/') && req.method === 'DELETE') { cart.delete(url.pathname.split('/').pop()); res.writeHead(200, { 'content-type': 'text/html' }); return res.end(cartHtml()); }
  if (url.pathname === '/' || url.pathname === '/spa') return serveFile(res, path.join(root, 'step-3-frontend-stacks', 'spa', 'index.html'));
  if (url.pathname === '/hda') return serveFile(res, path.join(root, 'step-3-frontend-stacks', 'hda', 'index.html'));
  return res.writeHead(404).end();
}

const server = http.createServer(handler);
if (require.main === module) server.listen(process.env.PORT || 3000, () => console.log(`Experiment server listening on ${process.env.PORT || 3000}`));
module.exports = { server, products, cart, cartSummary };
