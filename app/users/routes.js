var handlers = require('./handlers');


module.exports = [
  {name: 'new', pattern: '/users/new', handler: handlers.new_user},
  {name: 'list', pattern: '/users', handler: handlers.list_users},
  {name: 'details', pattern: '/users/:id', handler: handlers.user_details},
  {name: 'edit', pattern: '/users/:id/edit', handler: handlers.user_edit},
];
