var views = require('./views');


module.exports = [

  {name: 'list', pattern: '/buckets', view: views.list_buckets},
  {name: 'new', pattern: '/buckets/new', view: views.new_bucket},
  {name: 'create', pattern: '/buckets/new', view: views.create_bucket, method: 'POST'},
  {name: 'details', pattern: '/buckets/:id', view: views.bucket_details},
  {name: 'edit', pattern: '/buckets/:id/edit', view: views.bucket_edit},

];
