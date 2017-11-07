var api = require('../api-client');
var bole = require('bole');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var routes = require('../routes');

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
  ensureLoggedIn('/login'),
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
        res.redirect(routes.url_for('buckets.details', {id: bucket.id}));
      })
      .catch(function (error) {
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

exports.bucket_edit = [
  ensureLoggedIn('/login'),
  function(req, res, next) {
    let bucket_request = api.get_bucket(req.params.id);
    let apps_request = api.list_apps();
    let users_request = api.list_users();

    Promise
      .all([bucket_request, apps_request, users_request])
      .then((responses) => {
        let [bucket_response, apps_response, users_response] = responses;
        let template_args = {
          bucket: bucket_response,
          apps: apps_response.results,
          users: users_response.results,
        };
        res.render('buckets/edit.html', template_args);
      })
      .catch(next)
  },
];
