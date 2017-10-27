var views = require('./views');


module.exports = [

  {name: 'new', pattern: '/buckets/new', view: views.new_bucket},
  {name: 'details', pattern: '/buckets/:id', view: views.bucket_details}

];
