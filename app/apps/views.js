var api = require('../../lib/api-client');
var bole = require('bole');

var log = bole('apps-views');


exports.list_apps = function (req, res) {

  api.list_apps({members: [current_user]}).then(function (apps) {

    res.render('apps/list.html', {
      apps: apps
    });

  });
};


exports.list_user_apps = function (req, res) {

  api.list_user_apps(req.params.id).then(function (apps) {

    res.render('apps/list.html', {
      apps: apps
    });

  });
};


exports.app_details = function (req, res) {

  api.get_app(req.params.id).then(function (app) {

    res.render('apps/details.html', {
      app: app
    });

  });
};
