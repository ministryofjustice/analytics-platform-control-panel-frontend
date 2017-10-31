var api = require('../api-client');
var bole = require('bole');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var log = bole('buckets-views');


exports.list_buckets = [

  ensureLoggedIn('/'),
  function (req, res, next) {

    api.list_buckets()

      .then(function (buckets) {
        res.render('buckets/list.html', {buckets: buckets}); })

      .catch(next);
  }
];


exports.new_bucket = function (req, res) {

  res.render('buckets/new.html', {
    prefix: process.env.ENV + '-'
  });

};


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
