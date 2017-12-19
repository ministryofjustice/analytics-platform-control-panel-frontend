const handlers = require('./handlers');


module.exports = [
  { name: 'restart', pattern: '/tools/:name/restart', handler: handlers.restart },
  { name: 'deploy', method: 'POST', pattern: '/tools/:name/deploy', handler: handlers.deploy },
];
