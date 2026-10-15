import test from "node:test"; import assert from "node:assert/strict"; import { searchProducts, createCart, addToCart, cartSummary } from "../src/store.js";
test("search is case insensitive", () => assert.equal(searchProducts("MUG")[0].id, "mug"));
test("cart aggregates quantities and totals", () => { const c = createCart(); addToCart(c, "mug", 2); assert.equal(cartSummary(c).count, 2); assert.equal(cartSummary(c).total, 49.8); });
test("cart rejects unknown products and excess stock", () => { const c = createCart(); assert.throws(() => addToCart(c, "nope")); assert.throws(() => addToCart(c, "mug", 99)); });
