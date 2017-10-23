var views = require('./views');


module.exports = [

  {name: 'details', pattern: '/buckets/:id', view: views.bucket_details}

];
