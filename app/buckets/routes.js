const handlers = require('./handlers');


module.exports = [
  { name: 'list', pattern: '/buckets', handler: handlers.list_buckets },
  { name: 'new', pattern: '/buckets/new', handler: handlers.new_bucket },
  { name: 'create', pattern: '/buckets/new', handler: handlers.create_bucket, method: 'POST' },
  { name: 'details', pattern: '/buckets/:id', handler: handlers.bucket_details },
  { name: 'delete', method: 'POST', pattern: '/buckets/:id/delete', handler: handlers.delete },
  { name: 'aws', pattern: '/buckets/aws/:id', handler: handlers.aws },
];
