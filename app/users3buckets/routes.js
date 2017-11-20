const handlers = require('./handlers');


module.exports = [
  {
    name: 'create',
    method: 'POST',
    pattern: '/users3buckets',
    handler: handlers.create,
  },
  {
    name: 'update',
    method: 'POST',
    pattern: '/users3buckets/:id',
    handler: handlers.update,
  },
  {
    name: 'delete',
    method: 'POST',
    pattern: '/users3buckets/:id/delete',
    handler: handlers.delete,
  },
];
