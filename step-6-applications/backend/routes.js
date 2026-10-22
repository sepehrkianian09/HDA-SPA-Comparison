const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { findProduct, searchProducts } = require('./catalog');
const { sendHtml, sendJson, readForm, readJson } = require('./http');
const { cartSummary, productList } = require('./templates');

function createRouter({ cart, root }) {
  const pages = { '/': 'spa/index.html', '/spa': 'spa/index.html', '/hda': 'hda/index.html', '/spa/app.js': 'spa/app.js', '/spa/styles.css': 'shared/styles.css', '/shared/styles.css': 'shared/styles.css' };
  return async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'api') return routeApi(request, response, parts, url, cart);
    if (url.pathname === '/hda/products') return sendHtml(response, productList(searchProducts(url.searchParams.get('q'))));
    if (url.pathname === '/hda/cart' && request.method === 'GET') return sendHtml(response, cartSummary(cart));
    if (url.pathname === '/hda/cart' && request.method === 'POST') return addHdaItem(request, response, cart);
    if (parts[0] === 'hda' && parts[1] === 'cart' && request.method === 'DELETE') { cart.remove(findProduct(parts[2])); return sendHtml(response, cartSummary(cart)); }
    if (pages[url.pathname]) return servePage(response, root, pages[url.pathname]);
    response.writeHead(404).end();
  };
}
async function routeApi(request, response, parts, url, cart) {
  if (request.method === 'GET' && parts[1] === 'products') return sendJson(response, 200, searchProducts(url.searchParams.get('q')));
  if (request.method === 'GET' && parts[1] === 'cart') return sendJson(response, 200, cart.snapshot());
  if (request.method === 'POST' && parts[1] === 'cart') { let body; try { body = await readJson(request); } catch { return sendJson(response, 400, { error: 'Invalid JSON' }); } const product = findProduct(body.productId); const quantity = Number(body.quantity ?? 1); if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return sendJson(response, 400, { error: 'Product or quantity is invalid' }); cart.add(product, quantity); return sendJson(response, 201, cart.snapshot()); }
  if (request.method === 'DELETE' && parts[1] === 'cart' && parts[2]) { const product = findProduct(parts[2]); if (!product || !cart.remove(product)) return sendJson(response, 404, { error: 'Cart item not found' }); return sendJson(response, 200, cart.snapshot()); }
  return sendJson(response, 404, { error: 'Not found' });
}
async function addHdaItem(request, response, cart) { const form = await readForm(request); const product = findProduct(form.get('productId')); if (product) cart.add(product, 1); return sendHtml(response, cartSummary(cart)); }
function servePage(response, root, page) { const file = path.join(root, 'step-3-frontend-stacks', page); fs.createReadStream(file).on('error', () => response.writeHead(404).end()).pipe(response); }
module.exports = { createRouter };
