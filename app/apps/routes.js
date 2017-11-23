const handlers = require('./handlers');


module.exports = [
  { name: 'new', pattern: '/apps/new', handler: handlers.new },
  { name: 'list', pattern: '/apps', handler: handlers.list },
  { name: 'create', method: 'POST', pattern: '/apps/create', handler: handlers.create },
  { name: 'details', pattern: '/apps/:id', handler: handlers.details },
  { name: 'delete', method: 'POST', pattern: '/apps/:id/delete', handler: handlers.delete },
];
