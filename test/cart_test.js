const Order = require("../lib/sales/order");
const Product = require("../lib/sales/catalog").DigitalProduct;
const assert = require("assert");

describe('Basic Cart Operations', () => {

  describe('Adding 1 valid product to empty cart', () => {
    let order, res, product;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      product = new Product({sku: "TEST", price: 10.00})
      res = order.addItem(product)
    });

    it('is successful', () => assert(res.success));
    it('adds one item to items', () => assert(order.itemCount === 1));
    it('updates the total to price of product', () => assert(order.amountDue === 10.00, JSON.stringify(order)));
  });

  describe('Adding an invalid product', () => {
    let order, res;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      res = order.addItem()
    });
    it('is not successful', ()=> assert(!res.success));
    it('is ignored without throwing', ()=> assert(true));
    it('returns an error message', () => assert(res.message));
  });

  describe('Adding a product already in cart', () => {
    let order, res;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      order.addItem({sku: "TEST", price: 10.00})
      res = order.addItem({sku: "TEST", price: 10.00})
    });
    it('is successful', () => assert(res.success));
    it('increments the quantity', () => assert(res.item.quantity === 2));
    it('resets the totals', () => assert(order.amountDue === 20.00));
  });

  describe('Removing a product from cart', () => {
    let order, res;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      order.addItem({sku: "TEST", price: 10.00})
      res = order.removeItem("TEST");
    });
    it('is successful', () => assert(res.success));
    it('empties the cart', () => assert(order.items.length === 0));
    it('resets the cart totals', () => assert(order.itemCount === 0 && order.amountDue === 0));
  });

  describe('Removing a product from cart thats not there', () => {
    let order, res;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      order.addItem({sku: "TEST", price: 10.00})
      res = order.removeItem("SLUGJ");
    });
    it('is not successful', () => assert(!res.success));
    it('does not throw', () => assert(true));
  });

  describe('Updating a product quantity in cart', () => {
    let order, res;
    before(() => {
      order = new Order({key: "TEST", email: "test@test.com"});
      order.addItem({sku: "TEST", price: 10.00})
      res = order.updateItemQuantity("TEST", 10)
    });
    it('is successful', () => assert(res.success));
    it('resets quantity to existing + 10', () => assert.equal(res.item.quantity, 11));
    it('resets the item count', () => assert.equal(order.itemCount,11));
    it('resets the cart total', () => assert.equal(order.amountDue, 110));
  });
});



