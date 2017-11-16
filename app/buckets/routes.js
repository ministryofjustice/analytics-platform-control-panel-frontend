var handlers = require('./handlers');


module.exports = [
  {name: 'list', pattern: '/buckets', handler: handlers.list_buckets},
  {name: 'new', pattern: '/buckets/new', handler: handlers.new_bucket},
  {name: 'create', pattern: '/buckets/new', handler: handlers.create_bucket, method: 'POST'},
  {name: 'details', pattern: '/buckets/:id', handler: handlers.bucket_details},
];
