//Typical cart stuff
//Store in DB so we can track stuff
const assert = require("assert");
const shortid = require("shortid");
const moment = require("moment");

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

//I like sequential identifiers that have some kind of date information
//change this as you like, of course
const orderKey = () => {
  const dateString = moment().format("YYYY-MM-DD")
  return  `${dateString}-${shortid.generate()}`;
}

class Order {
  constructor({
    email = null,
    status="open",
    key = orderKey(),
    customer = {},
    payment = {},
    charge = {},
    discount = {code: null, amount: 0},
    createdAt = new Date(),
    amountDue=0,
    amountPaid=0,
    items = []
  }) {
    //assert(email, "An email address is required");
    this.email = email;
    this.key = key;
    this.customer = customer;
    this.discount = discount;
    this.status = status;
    this.payment = payment;
    this.charge = charge;
    this.createdAt = createdAt;
    this.items = items;
    this.amountDue = amountDue;
    this.amountPaid = amountPaid;
    this.itemCount = 0;
    //init the totals
    this.subtotal = 0;
    this.calculateTotals();
  }
  calculateTotals() {
    this.discount.amount = this.items.reduce((t, item) => t + (item.discount * item.quantity), 0);
    this.subtotal = this.items.reduce((t, item) => t + (item.product.price * item.quantity), 0);
    this.amountDue = this.subtotal - this.discount.amount;
    this.itemCount = this.items.reduce((t, item) => t + item.quantity, 0);
  }
  //TODO: Is this OK to pass in here?
  addItem(product, quantity=1, discount=0) {
    //TODO: I could look up the product here I suppose
    //that way I have the correct info...
    if(!product) return({success: false, message: "Invalid cart item"})

    const existing = this.findItem(product.sku);
    if(existing){
      return this.updateItemQuantity(product.sku, quantity);
    }else{
      this.items.push({product: product, quantity: quantity, discount: discount})
      this.calculateTotals();
      return({success: true, message: "Item added", cart: this})
    }

  }
  findItem(sku) {
    return this.items.find(x => x.product.sku === sku);
  }

  removeItem(sku) {
    const found = this.findItem(sku);
    if(found){
      this.items = this.items.filter(x => x.product.sku !== sku);
      this.calculateTotals();
      return {success: true, deleted: found}
    }else{
      return {success: false, sku: sku}
    }
  }
  updateItemQuantity(sku, quantity) {
    const item = this.findItem(sku);
    if(item){
      item.quantity += quantity;
      this.calculateTotals();
      return {success: true, item: item};
    }else{
      return {success: false, item: null};
    }
  }
  validateForPayment(){
    //there has to be items
    if(this.itemCount <= 0) return {success: false, message: "There are no items"}

    //the amountDue has to be >=0 we don't want to be owing people money
    if(this.amountDue <=0) return {success: false, message: "The amount due is negative"}

    //the payment will be validated by the processor, no need to duplicate that here
    if(this.status !== "open") return {success: false, message: "This order is not open"}

    return {success: true}
  }
}

module.exports = Order;
