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
        let [user_response, apps_response, buckets_response] = responses;
        let template_args = {
          user: user_response,
          apps: apps_response.results,
          buckets: buckets_response.results,
        };
        res.render('users/edit.html', template_args);
      })
      .catch(next)
  },
];
