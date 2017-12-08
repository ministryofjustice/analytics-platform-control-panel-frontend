const handlers = require('./handlers');


module.exports = [
  { name: 'list', pattern: '/tools', handler: handlers.list },
  { name: 'restart', pattern: '/tools/:id/restart', handler: handlers.restart },
];
