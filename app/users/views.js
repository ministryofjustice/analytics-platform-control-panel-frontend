var api = require('../../lib/api-client');
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

    res.render('users/details.html', {
      user: user
    });

  });
};
