const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

let base;
let app;

async function request(path, options) { return fetch(`${base}${path}`, options); }
async function jsonRequest(path, options) { return (await request(path, options)).json(); }
async function startServer() { app = createServer(); await new Promise(resolve => app.server.listen(0, resolve)); base = `http://127.0.0.1:${app.server.address().port}`; }

test.before(startServer);
test.after(() => app.server.close());
test.afterEach(() => app.cart.clear());

test('lists and searches products', async () => {
  const response = await request('/api/products?q=stand');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).length, 1);
});

test('renders the HDA catalog and cart fragment', async () => {
  assert.match(await (await request('/hda/products')).text(), /Aluminum Desk Stand/);
  const cart = await request('/hda/cart', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'productId=stand' });
  assert.match(await cart.text(), /Cart: 1 item/);
});

test('adds and removes a cart item', async () => {
  const added = await jsonRequest('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: 'lamp' }) });
  assert.equal(added.items, 1);
  const removed = await jsonRequest('/api/cart/lamp', { method: 'DELETE' });
  assert.equal(removed.items, 0);
});

test('rejects invalid cart input', async () => {
  const response = await request('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: 'nope' }) });
  assert.equal(response.status, 400);
});
