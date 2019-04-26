global.assert = require("assert");
const Sales = require("../../lib/sales");
global.assert = require("assert");
global.testStorage = require("./storage");
require("dotenv").config();
global.shopping = Sales.init({
  store:testStorage
});

// global.resetDb = async () => {
//   await Sales.init();
//   //add some products
//   const products = [
//     {sku: "BLADES", price: 10.00, name: "Blade Runner Roller Blades", publishedAt: new Date()},
//     {sku: "BEEF", price: 20.00, name: "A Pound of Beef", publishedAt: new Date()},
//     {sku: "BUBBLES", price: 30.00, name: "Seriously fun bubbles", publishedAt: new Date()}
//   ];

//   for(let i = 0; i < products.length; i++){
//     const p = products[i];
//     await Sales.catalogTable.save(p);
//   }

//   console.log("Ready!");
// }
