var views = require('./views');


module.exports = [

  {name: 'new', pattern: '/apps/new', view: views.new_app},
  {name: 'list', pattern: '/apps', view: views.list_apps},
  {name: 'list_user_apps', pattern: '/user/:id/apps', view: views.list_user_apps},
  {name: 'details', pattern: '/apps/:id', view: views.app_details}

];
