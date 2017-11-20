var { User, api } = require('../api-client');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


exports.list_users = [
  ensureLoggedIn('/login'),
  function (req, res, next) {

    User.list()

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

const get_apps_options = (user, all_apps) => {
  const associated_ids = user.userapps.map(ua => ua.app.id);

  return all_apps.filter(app => !associated_ids.includes(app.id));
};

const get_buckets_options = (user, all_buckets) => {
  const associated_ids = user.users3buckets.map(us => us.s3bucket.id);

  return all_buckets.filter(bucket => !associated_ids.includes(bucket.id));
};

exports.user_edit = [
  ensureLoggedIn('/login'),
  function(req, res, next) {
    const user_request = api.get_user(req.params.id);
    const apps_request = api.list_apps();
    const buckets_request = api.list_buckets();

    Promise
      .all([user_request, apps_request, buckets_request])
      .then((responses) => {
        const [user, apps_response, buckets_response] = responses;
        const all_apps = apps_response.results;
        const all_buckets = buckets_response.results;

        const template_args = {
          user: user,
          apps_options: get_apps_options(user, all_apps),
          buckets_options: get_buckets_options(user, all_buckets),
        };
        res.render('users/edit.html', template_args);
      })
      .catch(next)
  },
];
