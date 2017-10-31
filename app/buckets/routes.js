var views = require('./views');


module.exports = [

  {name: 'list', pattern: '/buckets', view: views.list_buckets},
  {name: 'new', pattern: '/buckets/new', view: views.new_bucket},
  {name: 'details', pattern: '/buckets/:id', view: views.bucket_details}

];
