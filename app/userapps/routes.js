const handlers = require('./handlers');


module.exports = [
  {
    name: 'create',
    method: 'POST',
    pattern: '/userapps',
    handler: handlers.create,
  },
  {
    name: 'update',
    method: 'POST',
    pattern: '/userapps/:id',
    handler: handlers.update,
  },
  {
    name: 'delete',
    method: 'POST',
    pattern: '/userapps/:id/delete',
    handler: handlers.delete,
  },
];
