import { readFile } from "node:fs/promises";
import path from "node:path";

const contentTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

export function sendJson(response, status, data) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(data));
  return true;
}

export function sendText(response, status, message) {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
  return true;
}

export function sendRedirect(response, location) {
  response.writeHead(303, { location });
  response.end();
  return true;
}

export async function readForm(request) {
  let raw = "";
  for await (const chunk of request) raw += chunk;
  return new URLSearchParams(raw);
}

export async function serveAsset(response, requestPath, publicDir) {
  const asset = requestPath === "/styles.css" ? "/styles.css" : requestPath === "/spa/app.js" ? "/app.js" : requestPath;
  const filePath = path.join(publicDir, asset);
  if (!filePath.startsWith(publicDir + path.sep)) return false;
  try {
    const data = await readFile(filePath);
    response.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
