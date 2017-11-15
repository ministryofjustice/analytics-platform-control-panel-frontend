var handlers = require('./handlers');


module.exports = [
  {name: 'create', method: 'POST', pattern: '/users3buckets', handler: handlers.create},
  // {name: 'delete', method: 'POST', pattern: '/users3buckets/:id/delete', view: handlers.delete},
  // {name: 'update', method: 'POST', pattern: '/users3buckets/:id', view: handlers.delete},
];
