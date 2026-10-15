import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addToCart, cartSummary, createCart, searchProducts } from "./store.js";
import { readForm, sendJson, sendRedirect, sendText, serveAsset } from "./http.js";
import { renderHdaPage } from "./views.js";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public");

function getSessionId(request) {
  return request.headers.cookie?.match(/(?:^|;\s*)session=([^;]+)/)?.[1] || "anonymous";
}

function getCart(carts, sessionId) {
  if (!carts.has(sessionId)) carts.set(sessionId, createCart());
  return carts.get(sessionId);
}

function setSession(response, sessionId) {
  response.setHeader("set-cookie", `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
}

async function addItem(request, response, cart, isApi) {
  try {
    const form = await readForm(request);
    addToCart(cart, form.get("id"), form.get("quantity") || 1);
    return isApi ? sendJson(response, 201, cartSummary(cart)) : sendRedirect(response, "/hda/cart");
  } catch (error) {
    return isApi ? sendJson(response, 400, { error: error.message }) : sendText(response, 400, error.message);
  }
}

async function routeApi(request, response, url, cart) {
  if (url.pathname === "/api/products" && request.method === "GET") return sendJson(response, 200, { products: searchProducts(url.searchParams.get("q") || "") });
  if (url.pathname === "/api/cart" && request.method === "GET") return sendJson(response, 200, cartSummary(cart));
  if (url.pathname === "/api/cart" && request.method === "POST") return addItem(request, response, cart, true);
  if (url.pathname === "/api/checkout" && request.method === "POST") {
    if (!cart.size) return sendJson(response, 400, { error: "Cart is empty" });
    const order = { id: `ord-${Date.now()}`, ...cartSummary(cart) };
    cart.clear();
    return sendJson(response, 201, order);
  }
  return false;
}

async function routeHda(request, response, url, cart) {
  if (url.pathname === "/hda/cart" && request.method === "POST") return addItem(request, response, cart, false);
  if (url.pathname === "/hda/checkout" && request.method === "POST") { cart.clear(); return sendRedirect(response, "/hda/"); }
  if (!url.pathname.startsWith("/hda") || request.method !== "GET") return false;
  const page = renderHdaPage(url, cartSummary(cart));
  if (!page) return false;
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(page);
  return true;
}

export function createServer() {
  const carts = new Map();
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const sessionId = getSessionId(request);
      const cart = getCart(carts, sessionId);
      setSession(response, sessionId);
      if (await routeApi(request, response, url, cart)) return;
      if (await routeHda(request, response, url, cart)) return;
      if (await serveAsset(response, url.pathname, publicDir)) return;
      if (url.pathname.startsWith("/spa")) return serveAsset(response, "/spa.html", publicDir);
      sendText(response, 404, "Not found");
    } catch (error) {
      console.error(error);
      sendText(response, 500, "Server error");
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "127.0.0.1";
  createServer().listen(port, host, () => console.log(`SPA/HDA experiment: http://${host}:${port}`));
}
