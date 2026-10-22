const http = require('node:http');
const path = require('node:path');
const { createCart } = require('./cart');
const { createRouter } = require('./routes');

function createServer() {
  const cart = createCart();
  const root = path.resolve(__dirname, '..', '..');
  return { server: http.createServer(createRouter({ cart, root })), cart };
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().server.listen(port, () => console.log(`Experiment server listening on ${port}`));
}

module.exports = { createServer };
