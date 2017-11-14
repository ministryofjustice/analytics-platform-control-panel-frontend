var views = require('./views');


module.exports = [

  {name: 'new', pattern: '/apps/new', view: views.new_app},
  {name: 'list', pattern: '/apps', view: views.list_apps},
  {name: 'create', method: 'POST', pattern: '/apps/create', view: views.create_app},
  // TODO: Rename to `connect_bucket` => `grant_bucket_access`
  {name: 'connect_bucket', method: 'POST', pattern: '/apps/:app_id/connect_bucket', view: views.connect_bucket},
  {name: 'list_user_apps', pattern: '/user/:id/apps', view: views.list_user_apps},
  {name: 'details', pattern: '/apps/:id', view: views.app_details},

];
