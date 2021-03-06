const handlers = require('./handlers');


module.exports = [
  { name: 'home', pattern: '/', handler: handlers.home },
  { name: 'tools', pattern: '/tools', handler: handlers.tools },
  { name: 'whats-new', pattern: '/whats-new', handler: handlers.whats_new },
  { name: 'callback', pattern: '/callback', handler: handlers.auth_callback },
  { name: 'login', pattern: '/login', handler: handlers.login },
  { name: 'logout', pattern: '/logout', handler: handlers.logout },
  { name: 'error', pattern: '/error', handler: handlers.error_test },
  { name: 'healthz', pattern: '/healthz', handler: handlers.healthz },
];
