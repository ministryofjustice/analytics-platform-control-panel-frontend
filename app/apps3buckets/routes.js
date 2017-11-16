const handlers = require('./handlers');


module.exports = [
  {
    name: 'create',
    method: 'POST',
    pattern: '/apps3buckets',
    handler: handlers.create,
  },
  // {
  //   name: 'update',
  //   method: 'POST',
  //   pattern: '/apps3buckets/:id',
  //   handler: handlers.update,
  // },
  // {
  //   name: 'destroy',
  //   method: 'POST',
  //   pattern: '/apps3buckets/:id/destroy',
  //   handler: handlers.destroy,
  // },
];
