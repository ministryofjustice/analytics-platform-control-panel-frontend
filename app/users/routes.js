var handlers = require('./handlers');


module.exports = [
  {name: 'new', pattern: '/users/new', handler: handlers.new_user},
  {name: 'list', pattern: '/users', handler: handlers.list_users},
  {name: 'details', pattern: '/users/:id', handler: handlers.user_details},
  {name: 'edit', pattern: '/users/:id/edit', handler: handlers.edit},
  {name: 'verify_email', pattern: '/users/:id/verify-email', handler: handlers.verify_email},
  {name: 'verify_email', method: 'POST', pattern: '/users/:id/verify-email', handler: handlers.verify_email},
];
