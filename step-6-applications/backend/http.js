function sendJson(response, status, body) { response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(body)); }
function sendHtml(response, body, status = 200) { response.writeHead(status, { 'content-type': 'text/html; charset=utf-8' }); response.end(body); }
function readBody(request, parse) { return new Promise((resolve, reject) => { let body = ''; request.setEncoding('utf8'); request.on('data', chunk => { body += chunk; }); request.on('end', () => { try { resolve(parse(body)); } catch (error) { reject(error); } }); request.on('error', reject); }); }
const readJson = request => readBody(request, body => JSON.parse(body || '{}'));
const readForm = request => readBody(request, body => new URLSearchParams(body));
module.exports = { sendJson, sendHtml, readJson, readForm };
