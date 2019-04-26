const Table = require("../../lib/storage/azure/table_storage");

const products = require('./products.json')

const productTable = new Table({name: "products", key: "sku"});

// const loadProducts = async () => {
//   for(let p of products){
//     console.log("Saving ", p.sku);
//     p.supplier = p.supplier.name;
//     p.productType = p.productType.name;
//     p.image = p.images[0].url;

//     delete(p.images);
//     delete(p["Store Inventory"])
//     delete(p.image_cdn);

//     console.log(p);
//     await productTable.save(p);
//   }
// }

const getProducts = async ()=>{
  const products = await productTable.all()
  console.log(products);
}

getProducts();
