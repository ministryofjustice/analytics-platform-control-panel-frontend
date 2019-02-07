const handlers = require('./handlers');


module.exports = [
  { name: 'new', pattern: '/users/new', handler: handlers.new_user },
  { name: 'list', pattern: '/users', handler: handlers.list_users },
  { name: 'details', pattern: '/users/:id', handler: handlers.details },
  { name: 'update', method: 'POST', pattern: '/users/:id/edit', handler: handlers.update },
  { name: 'verify_email', pattern: '/verify-email', handler: handlers.verify_email },
  { name: 'verify_email', method: 'POST', pattern: '/verify-email', handler: handlers.verify_email },
  { name: 'delete', method: 'POST', pattern: '/users/:id/delete', handler: handlers.delete },
  { name: 'reset_mfa', method: 'POST', pattern: '/users/:id/reset-mfa', handler: handlers.reset_mfa },
];
