var azure = require('azure-storage');
var queueSvc = azure.createQueueService();

exports.createQueue = function(name){
  return new Promise((res,rej) => {
    queueSvc.createQueueIfNotExists(name, function(error, results, response){
      if(error) rej(error);
      else res(results);
    });
  });

}


exports.enqueue = async function(name, data){
  const self = this;
  return new Promise((res,rej) => {
    queueSvc.createMessage(name, JSON.stringify(data), async function(error, results, response){
      if(error){
        if(error.message.indexOf("does not exist")){
          console.log("Queue doesn't exist... creating...");
          await self.createQueue(name);
          return await self.enqueue(name, data);
        }
      } else {
        res(results);
      }
    });
  });
}

exports.dequeue = async function(name){
  return new Promise((res,rej) => {
    queueSvc.getMessages(name, function(error, results, response){
      if(error) rej(error);
      else{
        var message = results[0];
        queueSvc.deleteMessage(name, message.messageId, message.popReceipt, function(error, response){
          if(error) rej(error);
          else res(JSON.parse(message.messageText));
        });
      }
    });
  });
}
