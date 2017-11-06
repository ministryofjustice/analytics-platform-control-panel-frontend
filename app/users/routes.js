var views = require('./views');


module.exports = [

  {name: 'new', pattern: '/users/new', view: views.new_user},
  {name: 'list', pattern: '/users', view: views.list_users},
  {name: 'details', pattern: '/users/:id', view: views.user_details}

];
