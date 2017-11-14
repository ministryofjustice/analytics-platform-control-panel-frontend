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

const get_apps_options = (bucket, all_apps) => {
  const associated_ids = bucket.apps3buckets.map(as => as.app.id);

  return all_apps.filter(app => !associated_ids.includes(app.id));
};

const get_users_options = (bucket, all_users) => {
  const associated_ids = bucket.users3buckets.map(us => us.user.auth0_id);

  return all_users.filter(user => !associated_ids.includes(user.auth0_id));
};

exports.bucket_details = [
  ensureLoggedIn('/login'),
  function(req, res, next) {
    const bucket_request = api.get_bucket(req.params.id);
    const apps_request = api.list_apps();
    const users_request = api.list_users();

    Promise
      .all([bucket_request, apps_request, users_request])
      .then((responses) => {
        const [bucket, apps_response, users_response] = responses;
        const all_apps = apps_response.results;
        const all_users = users_response.results;

        const template_args = {
          bucket: bucket,
          apps_options: get_apps_options(bucket, all_apps),
          users_options: get_users_options(bucket, all_users),
        };
        res.render('buckets/details.html', template_args);
      })
      .catch(next)
  },
];


exports.grant_user_access = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const bucket_id = req.params.id;

    const users3bucket = {
      user: req.body.user_id,
      s3bucket: bucket_id,
      access_level: 'readonly',
      is_admin: false,
    };

    api.buckets.grant_user_access(users3bucket)
      .then(() => {
        res.redirect(routes.url_for('buckets.details', {id: bucket_id}));
      })
      .catch(next);
  }
];
