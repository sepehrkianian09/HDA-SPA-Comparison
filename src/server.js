import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { products, searchProducts, createCart, addToCart, cartSummary } from "./store.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const carts = new Map();
const json = (res, status, data) => { res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(data)); };
const escape = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

function layout(title, content, cart) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · Field & Form</title><link rel="stylesheet" href="/styles.css"></head><body><header><a class="brand" href="/hda/">Field & Form</a><nav><a href="/hda/">Shop</a> <a href="/hda/cart">Cart (<span id="cart-count">${cart.count}</span>)</a></nav></header><main>${content}</main><footer>Small goods, thoughtfully made.</footer></body></html>`;
}
function productCards(list, prefix) { return list.map(p => `<article class="card"><h2><a href="/${prefix}/product/${p.id}">${escape(p.name)}</a></h2><p>${escape(p.description)}</p><p class="price">$${p.price.toFixed(2)}</p><form method="post" action="/${prefix}/cart"><input type="hidden" name="id" value="${p.id}"><button>Add to cart</button></form></article>`).join(""); }
function hdaPage(url, cart) {
  const u = new URL(url, "http://localhost");
  if (u.pathname === "/hda/" || u.pathname === "/hda") return layout("Shop", `<section class="hero"><p class="eyebrow">EVERYDAY OBJECTS</p><h1>Useful things for slower days.</h1><form method="get"><label for="q">Search products</label><input id="q" name="q" value="${escape(u.searchParams.get("q") || "")}"><button>Search</button></form></section><section class="grid">${productCards(searchProducts(u.searchParams.get("q") || ""), "hda")}</section>`, cart);
  if (u.pathname === "/hda/cart") return layout("Cart", `<h1>Your cart</h1>${cart.count ? `<div class="cart">${cart.items.map(i => `<div class="cart-row"><span>${escape(i.product.name)} × ${i.quantity}</span><strong>$${(i.product.price * i.quantity).toFixed(2)}</strong></div>`).join("")}<p class="total">Total: $${cart.total.toFixed(2)}</p><form method="post" action="/hda/checkout"><button>Place order</button></form></div>` : `<p>Your cart is empty. <a href="/hda/">Continue shopping.</a></p>`}`, cart);
  const match = u.pathname.match(/^\/hda\/product\/(.+)$/); const product = match && products.find(p => p.id === match[1]);
  if (product) return layout(product.name, `<article class="detail"><p class="eyebrow">${escape(product.category)}</p><h1>${escape(product.name)}</h1><p>${escape(product.description)}</p><p class="price">$${product.price.toFixed(2)}</p><form method="post" action="/hda/cart"><input type="hidden" name="id" value="${product.id}"><label>Quantity <input name="quantity" type="number" value="1" min="1" max="${product.stock}"></label><button>Add to cart</button></form></article>`, cart);
  return null;
}

async function body(req) { let text = ""; for await (const chunk of req) text += chunk; return new URLSearchParams(text); }
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const u = new URL(req.url, "http://localhost"); const session = req.headers.cookie?.match(/session=([^;]+)/)?.[1] || "anonymous";
      if (!carts.has(session)) carts.set(session, createCart()); const cart = carts.get(session);
      res.setHeader("set-cookie", `session=${session}; Path=/; HttpOnly`);
      if (u.pathname === "/api/products") return json(res, 200, { products: searchProducts(u.searchParams.get("q") || "") });
      if (u.pathname === "/api/cart" && req.method === "GET") return json(res, 200, cartSummary(cart));
      if (u.pathname === "/api/cart" && req.method === "POST") { const form = await body(req); try { addToCart(cart, form.get("id"), form.get("quantity") || 1); return json(res, 201, cartSummary(cart)); } catch (e) { return json(res, 400, { error: e.message }); } }
      if (u.pathname === "/api/checkout" && req.method === "POST") { if (!cart.size) return json(res, 400, { error: "Cart is empty" }); const order = { id: `ord-${Date.now()}`, ...cartSummary(cart) }; cart.clear(); return json(res, 201, order); }
      if (u.pathname === "/hda/cart" && req.method === "POST") { const form = await body(req); try { addToCart(cart, form.get("id"), form.get("quantity") || 1); res.writeHead(303, { location: "/hda/cart" }); return res.end(); } catch (e) { res.writeHead(400, { "content-type": "text/plain" }); return res.end(e.message); } }
      if (u.pathname === "/hda/checkout" && req.method === "POST") { if (!cart.size) { res.writeHead(303, { location: "/hda/cart" }); return res.end(); } cart.clear(); res.writeHead(303, { location: "/hda/" }); return res.end(); }
      if (u.pathname === "/styles.css" || u.pathname === "/spa/app.js") { const file = u.pathname === "/styles.css" ? path.join(root, "../public/styles.css") : path.join(root, "../public/app.js"); const data = await readFile(file); res.writeHead(200, { "content-type": u.pathname.endsWith(".css") ? "text/css" : "text/javascript" }); return res.end(data); }
      if (u.pathname.startsWith("/spa")) { const data = await readFile(path.join(root, "../public/spa.html")); res.writeHead(200, { "content-type": "text/html" }); return res.end(data); }
      if (u.pathname.startsWith("/hda")) { const page = hdaPage(req.url, cartSummary(cart)); if (page) { res.writeHead(200, { "content-type": "text/html" }); return res.end(page); } }
      res.writeHead(404); res.end("Not found");
    } catch (e) { res.writeHead(500); res.end("Server error"); }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) createServer().listen(3000, "127.0.0.1", () => console.log("SPA/HDA experiment: http://127.0.0.1:3000"));
