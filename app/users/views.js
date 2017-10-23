var api = require('../api-client');
var bole = require('bole');

var log = bole('users-views');


exports.list_users = function (req, res) {

  api.list_users().then(function (users) {

    res.render('users/list.html', {
      users: users
    });

  });
};


exports.user_details = function (req, res) {

  api.get_user(req.params.id).then(function (user) {

    user.apps = [
      {'name': 'Test App', 'role': 0, 'id': 1}
    ];

    res.render('users/details.html', {
      signedInUser: (user.username == 'andy'),
      user: user
    });

  });
};
