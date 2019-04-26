const Order = require("../../lib/sales/order");

class TestStorage{
  constructor(){
    this.orders = [];
    this.queue = [];
    this.products = [
      {sku: "BLADES", price: 10.00, name: "Blade Runner Roller Blades", publishedAt: new Date(), digital:true, requires_shipping:false, download_url: "http://X"},
      {sku: "BEEF", price: 20.00, name: "A Pound of Beef", publishedAt: new Date()},
      {sku: "BUBBLES", price: 30.00, name: "Seriously fun bubbles", publishedAt: new Date()}
    ];
  }
  async deleteOrder(key){
    this.orders = this.orders.filter(x => x.key !== key);
    return new Promise((res, rej) => res({success: true}))
  }
  async saveOrder(order){
    return new Promise((res,rej) => res(this.orders.push(order)));
  }
  async getCart(key){
    const found = this.orders.find(x => x.key === key) || new Order({key: key});
    return new Promise((res,rej) => res(found));
  }
  async getProduct(sku){
    const products = await this.getProducts();
    return new Promise((res,rej) => res(products.find(x => x.sku === sku)));
  }
  async getProducts(){
    return new Promise((res,rej) => res(this.products));
  }
  async enqueuNewOrder(order){
    return new Promise((res,rej) => res(this.queue.push(order)));
  }
}

module.exports = new TestStorage();
