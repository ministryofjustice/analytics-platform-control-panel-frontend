var handlers = require('./handlers');


module.exports = [
  {name: 'new', pattern: '/apps/new', handler: handlers.new_app},
  {name: 'list', pattern: '/apps', handler: handlers.list_apps},
  {name: 'create', method: 'POST', pattern: '/apps/create', handler: handlers.create_app},
  {name: 'list_user_apps', pattern: '/user/:id/apps', handler: handlers.list_user_apps},
  {name: 'details', pattern: '/apps/:id', handler: handlers.app_details},
];
