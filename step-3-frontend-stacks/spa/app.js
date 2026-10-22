const { useEffect, useState } = React;

function ProductCard({ product, onAdd, onRemove, inCart }) {
  return React.createElement('article', { className: 'card' },
    React.createElement('h2', null, product.name),
    React.createElement('p', null, product.description),
    React.createElement('strong', null, `$${product.price}`),
    React.createElement('br'),
    React.createElement('button', { onClick: () => onAdd(product.id) }, 'Add to cart'),
    inCart && React.createElement('button', { onClick: () => onRemove(product.id) }, ' Remove'));
}

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: 0, total: 0 });

  useEffect(() => { fetch(`/api/products?q=${encodeURIComponent(query)}`).then(response => response.json()).then(setProducts); }, [query]);
  const add = id => fetch('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: id }) }).then(response => response.json()).then(setCart);
  const remove = id => fetch(`/api/cart/${id}`, { method: 'DELETE' }).then(response => response.json()).then(setCart);
  const inCart = id => cart.entries?.some(entry => entry.product.id === id);

  return React.createElement(React.Fragment, null,
    React.createElement('h1', null, 'Desk Shop'),
    React.createElement('label', null, 'Search products ', React.createElement('input', { value: query, onChange: event => setQuery(event.target.value), placeholder: 'Try stand' })),
    React.createElement('p', { role: 'status' }, `Cart: ${cart.items} item(s), $${cart.total}`),
    React.createElement('section', null, products.map(product => React.createElement(ProductCard, { key: product.id, product, onAdd: add, onRemove: remove, inCart: inCart(product.id) }))));
}

ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(App));
