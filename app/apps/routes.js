const handlers = require('./handlers');


module.exports = [
  { name: 'new', pattern: '/apps/new', handler: handlers.new },
  { name: 'list', pattern: '/apps', handler: handlers.list },
  { name: 'create', method: 'POST', pattern: '/apps/create', handler: handlers.create },
  { name: 'details', pattern: '/apps/:id', handler: handlers.details },
  { name: 'delete', method: 'POST', pattern: '/apps/:id/delete', handler: handlers.delete },
  //{ name: 'connect_bucket', method: 'POST', pattern: '/apps/:app_id/buckets', handler: handlers.connect_bucket },
  //{ name: 'update_bucket', method: 'POST', pattern: '/apps/:app_id/buckets/:bucket_id', handler: handlers.update_bucket },
];
