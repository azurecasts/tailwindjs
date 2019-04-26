/* eslint-disable no-unused-vars */
//const Table = require("../../../lib/azure/table");
const redis = require("async-redis");
const client = redis.createClient();
const Order = require("../../../lib/sales/order");

client.on("error", function (err) {
  console.log("Error " + err);
});

class Service {
  constructor (options) {
    this.options = options || {};
    this.db = client;
  }

  async find (params) {
    return [];
  }

  async get (id, email) {
    //pull the cart with the idea, or create a new one
    let found = await client.get(`sales:cart:${id}`);
    if(!found){
      found = new Order({key: id, email: email});
    }
    return found;
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
