var api = require('../../lib/api-client');
var bole = require('bole');

var log = bole('buckets-views');


exports.bucket_details = function (req, res) {

  api.get_bucket(req.params.id).then(function (bucket) {

    res.render('buckets/details.html', {
      bucket: bucket
    });

  }).catch(function (err) {

    bucket = {
      id: 999,
      url: 'http://api:8000/s3buckets/999',
      name: 'dev-dummy-bucket',
      apps3buckets: [],
      created_by: 'github|123456'
    };

    res.render('buckets/details.html', {
      bucket: bucket
    });

  });
};
