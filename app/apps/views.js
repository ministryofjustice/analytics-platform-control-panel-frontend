var api = require('../../lib/api-client');
var bole = require('bole');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var log = bole('apps-views');


exports.list_apps = [
  ensureLoggedIn('/login'),
  function (req, res) {

    api.list_apps().then(function (apps) {

      res.render('apps/list.html', {
        apps: apps
      });

    });
  }
];


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

  }).catch(function (err) {

    var dummyUsers = [
        {
          id: 'github|123456',
          name: 'Harry Pierce',
          admin: true // probably would be role: <integer> or something?
        },
        {
          id: 'github|234567',
          name: 'Tom Quinn',
          admin: false
        },
        {
          id: 'github|345678',
          name: 'Zoe Reynolds',
          admin: true
        }
      ],
      dummyBuckets = [
        {
          id: 1,
          name: 'dev-dummy-bucket'
        }
      ],
      app = {
        name: 'That Dummy App',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec ligula mollis, vestibulum mi eget, finibus lorem. Nulla ornare velit.',
        repo_url: 'https://github.com/org-dummy-org/repo-dummy-repo',
        apps3buckets: [
          // array of numbers?
        ],
        userapps: [
          // no idea - I'd have expected app users maybe?
        ],
        users: dummyUsers,
        buckets: dummyBuckets
      };

    res.render('apps/details.html', {
      app: app
    });

  });
};
