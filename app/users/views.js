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
