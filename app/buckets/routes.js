var views = require('./views');


module.exports = [

  {name: 'list', pattern: '/buckets', view: views.list_buckets},
  {name: 'new', pattern: '/buckets/new', view: views.new_bucket},
  {name: 'create', pattern: '/buckets/new', view: views.create_bucket, method: 'POST'},
  {name: 'details', pattern: '/buckets/:id', view: views.bucket_details},
  {name: 'grant_user_access', method: 'POST', pattern: '/buckets/:id/grant_user_access', view: views.grant_user_access},
];
