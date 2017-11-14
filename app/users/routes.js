var views = require('./views');


module.exports = [
  {name: 'new', pattern: '/users/new', view: views.new_user},
  {name: 'list', pattern: '/users', view: views.list_users},
  {name: 'details', pattern: '/users/:id', view: views.user_details},
  {name: 'edit', pattern: '/users/:id/edit', view: views.user_edit},
  // {name: 'grant_bucket_access', method: 'POST', pattern: '/users/:id/grant_bucket_access', view: views.grant_bucket_access},
];
