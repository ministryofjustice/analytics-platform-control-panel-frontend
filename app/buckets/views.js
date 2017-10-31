var api = require('../api-client');
var bole = require('bole');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var log = bole('buckets-views');


exports.list_buckets = [

  ensureLoggedIn('/login'),
  function (req, res, next) {

    api.list_buckets()

      .then(function (buckets) {
        res.render('buckets/list.html', {buckets: buckets}); })

      .catch(next);
  }
];


exports.new_bucket = [
  function (req, res) {

    res.render('buckets/new.html', {
      prefix: process.env.ENV + '-'
    });

  }
];


exports.create_bucket = [
  ensureLoggedIn('/login'),
  function (req, res, next) {

    var bucket = {
      name: req.body['new-datasource-name'],
      apps3buckets: []
    };

    api.buckets.add(bucket)
      .then(function (bucket) {
        res.redirect(url_for('buckets.details', {id: bucket.id}));
      })
      .catch(function (error) {
        console.dir(error);
        res.render('buckets/new.html', {
          bucket: bucket,
          error: error
        });
      });
  }
];


exports.bucket_details = [
  ensureLoggedIn('/login'),
  function (req, res) {

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
  }
];