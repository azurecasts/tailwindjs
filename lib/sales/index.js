const defaultStorage = require("../storage/azure");
require("dotenv").config()
const Dinero = require('dinero.js');
const Order = require("./order");

// DO NOT put the key here in your code!
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class Sales{
  constructor(storage){
    this.storage = storage;
  }
  getProduct(sku){
    return this.storage.getProduct(sku);
  }
  async getCart(key){
    const cart = await this.storage.getCart(key);
    return cart || new Order({key: key});
  }
  async deleteCart(key){
    return this.storage.deleteOrder(key);
  }

  async saveCart(cart){
    await this.storage.saveOrder(cart);
    return {success: true, message: "Cart saved"}
  }

  async applyCoupon(order, coupon){
    //can the coupon be used with this order?
    const useCheck = coupon.canBeUsed(order)
    if(!useCheck.success) return {success: false, message: useCheck.message}

    //if there are no restrictions, this will be every item
    const discountItems = coupon.applicableItems(order);

    //what type of coupon? There's only 2 so far,
    //% off and mount off. Might fix later
    for(let item of discountItems){
      if(coupon.type === "percent"){
        item.discount = Dinero({amount: item.product.price}).percentage(coupon.amount).getAmount();
      }else{
        //if this is just a straight $$ off thing, the discount amount is
        //equal to the coupon amount
        item.discount = Dinero({amount: coupon.amount}).getAmount();
      }
    }

    order.discount.code = coupon.code;
    order.calculateTotals()

    //save the order - don't tick stats or anything
    //on the coupon until it's actually used
    await this.storage.saveOrder(order);

    return {success: true, order: order, coupon: coupon}
  }

  async checkoutStripe(order, token){
    //no order, no checkout
    if(!order) throw new Error("There's no order with the key ", key);

    //validate it
    const validation = order.validateForPayment();

    if(!validation.success) return validation

    //tick the status on the order, we need to know a charge is happening
    order.status="charge-pending"
    order.payment = token;
    await this.saveCart(order);


    //this will tell Stripe to authorize and capture
    //something you can do if you're selling digital goods
    //if you're not, you can only capture a charge when you
    //ship the goods
    const captureCharge=true;
    const amountInPennies = parseInt(order.amountDue * 100)

    try{
      order.charge = await stripe.charges.create({
        amount: amountInPennies,
        currency: "usd",
        capture: captureCharge,
        source: token.id, // obtained with Stripe.js
        description: `Charge for ${order.email}`
      })

      //this should be captured if you set "capture: true"
      order.status= captureCharge ? "paid" : "authorized";

      //drop the new order into the new order queue
      await this.storage.enqueuNewOrder(order);

    }catch(e){
      console.error(e);
      //the charge failed for whatever reason
      //log this as needed
      order.status="charge-failed";
      order.chargeError = e;
    }

    //yay, we're done! Save the cart...
    await this.saveCart(order);

    //return
    const orderSuccess = order.charge ? true : false;
    return {success: orderSuccess, order: order};
  }
}

exports.init = ({store=defaultStorage}) => {
  return new Sales(store)
}
