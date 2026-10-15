import { products, searchProducts } from "./store.js";

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character]));
}

function layout(title, content, cart) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} · Field &amp; Form</title><link rel="stylesheet" href="/styles.css"></head><body><header><a class="brand" href="/hda/">Field &amp; Form</a><nav><a href="/hda/">Shop</a> <a href="/hda/cart">Cart (<span id="cart-count">${cart.count}</span>)</a></nav></header><main>${content}</main><footer>Small goods, thoughtfully made.</footer></body></html>`;
}

function productCards(items) {
  return items.map(product => `<article class="card"><h2><a href="/hda/product/${product.id}">${escapeHtml(product.name)}</a></h2><p>${escapeHtml(product.description)}</p><p class="price">$${product.price.toFixed(2)}</p><form method="post" action="/hda/cart"><input type="hidden" name="id" value="${product.id}"><button>Add to cart</button></form></article>`).join("");
}

function renderShop(url, cart) {
  const query = url.searchParams.get("q") || "";
  return layout("Shop", `<section class="hero"><p class="eyebrow">EVERYDAY OBJECTS</p><h1>Useful things for slower days.</h1><form method="get"><label for="q">Search products</label><input id="q" name="q" value="${escapeHtml(query)}"><button>Search</button></form></section><section class="grid">${productCards(searchProducts(query))}</section>`, cart);
}

function renderCart(cart) {
  const contents = cart.count ? `<div class="cart">${cart.items.map(item => `<div class="cart-row"><span>${escapeHtml(item.product.name)} × ${item.quantity}</span><strong>$${(item.product.price * item.quantity).toFixed(2)}</strong></div>`).join("")}<p class="total">Total: $${cart.total.toFixed(2)}</p><form method="post" action="/hda/checkout"><button>Place order</button></form></div>` : `<p>Your cart is empty. <a href="/hda/">Continue shopping.</a></p>`;
  return layout("Cart", `<h1>Your cart</h1>${contents}`, cart);
}

function renderProduct(product, cart) {
  return layout(product.name, `<article class="detail"><p class="eyebrow">${escapeHtml(product.category)}</p><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.description)}</p><p class="price">$${product.price.toFixed(2)}</p><form method="post" action="/hda/cart"><input type="hidden" name="id" value="${product.id}"><label>Quantity <input name="quantity" type="number" value="1" min="1" max="${product.stock}"></label><button>Add to cart</button></form></article>`, cart);
}

export function renderHdaPage(url, cart) {
  if (url.pathname === "/hda" || url.pathname === "/hda/") return renderShop(url, cart);
  if (url.pathname === "/hda/cart") return renderCart(cart);
  const match = url.pathname.match(/^\/hda\/product\/([^/]+)$/);
  const product = match && products.find(item => item.id === match[1]);
  return product ? renderProduct(product, cart) : null;
}
