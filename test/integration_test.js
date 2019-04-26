
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const storage = require("../lib/storage/azure");
const sales = require("../lib/sales").init(storage);
const Order = require("../lib/sales/order");
//this will only work if the data has been loaded to storage
describe("Integration Testing", () => {
  describe("Azure Storage Catalog", () => {
    it("gets a product by sku", async () => {
      const p = await storage.getProduct("brush_cleaner");
      assert(p.price > 0);
    })
  });
  describe("Azure Shopping Cart", () => {
    it("saves an order as a cart", async () => {
      const order = new Order({key: "BOOP"});
      const res = await sales.saveCart(order);
      assert(res.success);
    });
    it("retrieves the cart", async ()=> {
      const res = await sales.getCart("BOOP");
      assert.equal(res.key, "BOOP");
    })
  });

  describe("Checkout out with Stripe", function() {
    describe("using a valid cart and cc number", function(){
      this.timeout(5000);
      let res, cart, token;
      before(async ()=> {
        const product = await sales.getProduct("brush_cleaner");
        cart = await sales.getCart("SALLY");
        cart.addItem(product);
      });

      it("is successful", async () => {
        token = await stripe.tokens.create({
          card: {
              "number": '4242424242424242',
              "exp_month": 12,
              "exp_year": 2021,
              "cvc": '123'
          }
        });
        res = await sales.checkoutStripe(cart, token)
        assert(res.success);
        assert(res.order.charge);
      })
    })
  })
})


