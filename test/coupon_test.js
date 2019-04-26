const Coupon = require("../lib/sales/coupon");
const Order = require("../lib/sales/order");

describe("Coupon Basics", () => {

  describe("The defaults", () => {

    let coupon = new Coupon({type: "percent", amount: 10});

    it("can be used on a simple order", () => {
      assert(!coupon.isExpired())
    })
    it('is not used up', () => {
      assert(!coupon.isUsedUp())
    });
    it('is active', () => {
      assert(coupon.isActive())
    });
  });
  describe("Past usage limit", () => {

    let coupon = new Coupon({usageCount: 5});

    it("is used up", () => {
      assert(coupon.isUsedUp())
    })
  });
  describe("Expiring today", () => {

    let coupon = new Coupon({expiresAt: new Date()});

    it("is too old", () => {
      assert(coupon.isExpired())
    })
  });

  describe("Used with a valid order with one item", () => {
    let coupon, order;
    before(()=> {
      coupon = new Coupon({type: "percent", amount: 10});
      order = new Order({key: "TEST"});
      order.addItem({sku: "BEEF", price: 10, name: "Beef Shank"});
    });

    it("can be used", ()=> {
      assert(coupon.canBeUsed(order).success);
    });
    it("has 1 applicable item", ()=> {
      assert.equal(coupon.applicableItems(order).length,1)
    });
  })

  describe("With a restriction that's in the order", () => {
    let coupon, order;
    before(()=> {
      coupon = new Coupon({type: "percent", amount: 10, restrictions: ["BEEF"]});
      order = new Order({key: "TEST"});
      order.addItem({sku: "BEEF", price: 10, name: "Beef Shank"});
      order.addItem({sku: "BLADE", price: 20, name: "Blade Runners"});
    });

    it("can be used", ()=> {
      assert(coupon.canBeUsed(order).success);
    });
    it("has one applicable item", () => {
      assert.equal(coupon.applicableItems(order).length,1)
    })
  })
  describe("With a restriction NOT in the order", () => {
    let coupon, order;
    before(()=> {
      coupon = new Coupon({type: "percent", amount: 10, restrictions: ["BLADE"]});
      order = new Order({key: "TEST"});
      order.addItem({sku: "BEEF", price: 10, name: "Beef Shank"});
    });

    it("can NOT be used", ()=> {
      assert(!coupon.canBeUsed(order).success);
    });
  })

});


