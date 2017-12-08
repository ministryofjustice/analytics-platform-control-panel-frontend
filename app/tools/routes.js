const handlers = require('./handlers');


module.exports = [
  { name: 'list', pattern: '/tools', handler: handlers.list },
  { name: 'restart', pattern: '/tools/:name/restart', handler: handlers.restart },
];
