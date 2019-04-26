const azureStorage = require("azure-storage");
const tableService = azureStorage.createTableService();

const azure = require('azure-table-storage-async');
const _ = require("underscore");

const TableQuery = azureStorage.TableQuery;

class Table{
  constructor(args){
    this.tableName = args.name;
    this.key = args.key,
    this.partitionKey = args.partitionkey || args.key;
  }

  async createYourself(){
    try{
      const res = await azure.createTableIfNotExistsAsync(tableService ,this.tableName)
    }catch(e){
      console.log(e);
      throw e;
    }
    return true;
  }

  async save(data){
    const self = this;
    try{
      //loop the data and create an entity based on type
      const record = this.buildRecord(data);
      const result = await azure.insertOrReplaceEntityAsync(tableService, this.tableName, record);
      return result;
    }catch(e){
      if(e.message.indexOf("does not exist") > -1){
        //if there's an exception here, create the table
        //on the fly
        console.log("Table doesn't exist - creating...");
        await this.createYourself();
        self.save(data);
      }else{
        console.error(e);
        throw e;
      }
    }
    return self;
  }

  async get(key){
    const q = new azureStorage.TableQuery().top(1).where("RowKey eq ?", this.key);
    const result =  await azure.queryEntitiesAsync(tableService, this.tableName, q);
    return toSingle(result);
  }

  async first(args){
    const filtered = await this.filter(args);
    return filtered.length > 0 ? filtered[0] : null;
  }
  async all(limit=500){
    const q = new TableQuery().top(limit);
    const result = await azure.queryEntitiesAsync(tableService, this.tableName, q);
    return toList(result);
  }
  async filter(args){
    const keys = Object.keys(args).map(a => `${a} == ?`);
    const condition = keys.join(" && ");
    const vals = Object.values(args);

    //right now, this is assuming args is an object
    const q = new TableQuery().where(condition, ...vals);
    try{
      const result =  await azure.queryEntitiesAsync(tableService, this.tableName, q);
      return toList(result);
    }catch(e){
      console.error(e);
      throw e;
    }
  }

  async delete(key, partitionKey){
    const pkey = partitionKey || key;
    try{
      await azure.deleteEntityAsync(tableService, this.tableName, {RowKey: key, PartitionKey: pkey})
      return true;
    }catch(e){
      console.log(e)
      if(e.message.indexOf("does not exist") > -1){
        console.log("Table doesn't exist - creating...");
        await this.createYourself();
      }else{
        console.error(e);
        throw e;
      }
    }

  }

  async where(condition, args){
    if(!_.isArray(args)) args = [args];
    return await this.filter(condition, args)
  }

  buildRecord(data){
    const EG = azureStorage.TableUtilities.entityGenerator;
    const record = {
      RowKey: EG.String(data[this.key]),
      PartitionKey: EG.String(data[this.partitionKey])
    };
    const keys = _.keys(data);
    for(const k of keys){
      if(_.isDate(data[k])) record[k] = EG.DateTime(data[k])
      else if(_.isBoolean(data[k])) record[k] = EG.Boolean(data[k])
      else if(isFloat(data[k])) record[k] = EG.Double(data[k])
      else if(isInt(data[k])) record[k] = EG.Int32(data[k])
      else if(_.isArray(data[k])) record[k] = EG.String(JSON.stringify(data[k]))
      else if(_.isObject(data[k])) record[k] = EG.String(JSON.stringify(data[k]))
      else record[k] = EG.String(data[k])
    }
    return record;
  }

}

const isInt = (n) => Number(n) === n && n % 1 === 0;
const isFloat = (n) =>  Number(n) === n && n % 1 !== 0;

const formatEntry = (entry) => {
  const timestamp = entry.Timestamp._;
  delete entry.RowKey;
  delete entry.PartitionKey;
  delete entry.Timestamp;
  delete entry[".metadata"]

  const keys = _.keys(entry);
  const out = {};

  for(k of keys) out[k] = entry[k]._;
  out.timestamp = timestamp;
  //the output
  return out;
}
const toSingle = (result) => {
  if(result.entries.length > 0){
    const entry = result.entries[0];
    return formatEntry(entry);
  }else{
    return [];
  }
}
const toList = result => {
  const out = [];
  for(const e of result.entries) out.push(formatEntry(e));
  return out;

}

module.exports = Table;
