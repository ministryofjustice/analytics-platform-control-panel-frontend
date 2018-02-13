const handlers = require('./handlers');


module.exports = [
  { name: 'new', pattern: '/users/new', handler: handlers.new_user },
  { name: 'list', pattern: '/users', handler: handlers.list_users },
  { name: 'details', pattern: '/users/:id', handler: handlers.user_details },
  { name: 'edit', pattern: '/users/:id/edit', handler: handlers.user_edit },
  { name: 'verify_email', pattern: '/verify-email', handler: handlers.verify_email },
  { name: 'verify_email', method: 'POST', pattern: '/verify-email', handler: handlers.verify_email },
  { name: 'delete', method: 'POST', pattern: '/delete', handler: handlers.delete },
];
