var api = require('../api-client');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


exports.list_users = [
  ensureLoggedIn('/login'),
  function (req, res, next) {

    api.list_users()

      .then(function (users) {
        res.render('users/list.html', {users: users}); })

      .catch(next);
  }
];


exports.new_user = [
  ensureLoggedIn('/login'),

  function (req, res) {

    res.render('users/new.html');

  }
];


exports.user_details = [
  ensureLoggedIn('/login'),
  function (req, res, next) {

    api.get_user(req.params.id)
      .then(function (user) {

        user.apps = [
          {'name': 'Test App', 'role': 0, 'id': 1}
        ];

        res.render('users/details.html', {
          signedInUser: (user.id == req.user.id),
          user: user
        });
      })
      .catch(next);
  }
];

exports.user_edit = [
  ensureLoggedIn('/login'),
  function(req, res, next) {
    let user_request = api.get_user(req.params.id);
    let apps_request = api.list_apps();
    let buckets_request = api.list_buckets();

    Promise
      .all([user_request, apps_request, buckets_request])
      .then((responses) => {
        const [user_response, apps_response, buckets_response] = responses;

        const all_apps = apps_response.results;
        const all_buckets = buckets_response.results;

        const app_ids_associated = user_response
          .userapps
          .map(ua => ua.app.id);
        const bucket_ids_associated = user_response
          .users3buckets
          .map(as => as.s3bucket.id);

        const apps_available = all_apps.filter(app => {
          return app_ids_associated.indexOf(app.id) < 0;
        });
        const buckets_available = all_buckets.filter(bucket => {
          return bucket_ids_associated.indexOf(bucket.id) < 0;
        });

        let template_args = {
          user: user_response,
          apps_available: apps_available,
          buckets_available: buckets_available,
        };
        res.render('users/edit.html', template_args);
      })
      .catch(next)
  },
];
