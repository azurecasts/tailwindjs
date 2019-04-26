const Coupon = require("../lib/sales/coupon");

describe("Shopping Basics", () => {
  describe("Saving a cart", () => {
    let res, cart;
    before(async () => {
      const product = await testStorage.getProduct("BEEF");
      cart = await shopping.getCart("TEST");
      cart.addItem(product);
      res = await shopping.saveCart(cart);
    })

    it("saves the cart successfully", async () => {
      assert(res.success)
    });

    it("sets the totals", async () => {
      assert.equal(cart.itemCount,1)
    });

    it("deletes the cart", async () => {
      res = await shopping.deleteCart("TEST");
      assert(res.success);
    })
  });

  describe("Applying a coupon to a valid order", () => {
    let res, cart, coupon
    before(async () => {
      coupon = new Coupon({type: "percent", amount: 10, restrictions: ["BEEF"]});
      const product = await testStorage.getProduct("BEEF");
      cart = await shopping.getCart("TEST");
      cart.addItem(product);
      res = await shopping.applyCoupon(cart, coupon);
    })

    it("sets the discount for the item to 2.00", () => {
      assert.equal(2, cart.items[0].discount)
    });

    it("sets the discount total to 2.00", ()=> {
      assert.equal(2, cart.discount.amount)
    })
    it("sets the cart total to 18.00", ()=> {
      assert.equal(18.00, cart.amountDue)
    })
  });
});
