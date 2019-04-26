// Initializes the `shopping` service on path `/shopping`
const createService = require('./shopping.class.js');
const hooks = require('./shopping.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/shopping', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('shopping');

  service.hooks(hooks);
};
