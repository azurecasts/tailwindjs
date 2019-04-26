const Table = require("./table_storage");
const Queue = require("./queues");
const CatalogTable = new Table({name: "products", key: "sku"});
const OrdersTable = new Table({name: "orders", key: "key"});

exports.getProduct = function(sku){
  return CatalogTable.first({sku: sku});
}

exports.saveOrder = function(order){
  const serialized = {
    key: order.key,
    email: order.email,
    createdAt: order.createdAt,
    updatedAt: new Date(),
    total: order.amountDue,
    itemCount: order.itemCount,
    data: JSON.stringify(order)
  }
  return OrdersTable.save(serialized);
}

exports.getCart = async function(key){
  const record = await OrdersTable.first({key: key, status: "open"});
  return record ? JSON.parse(record.data) : null;
}

exports.deleteOrder = function(key){
  return OrdersTable.delete(key);
}


exports.enqueuNewOrder = function(order){
  return Queue.enqueue("new-orders", order);
}

exports.dequeuNextOrder = function(){
  return Queue.dequeue("new-orders");
}
