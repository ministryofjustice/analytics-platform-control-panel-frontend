var api = require('../api-client');
var routes = require('../routes');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


exports.new_app = [

  ensureLoggedIn('/login'),

  function (req, res) {

    res.render('apps/new.html', {
      prefix: process.env.ENV + '-',
      buckets: [
        {
          id: 1,
          name: 'dev-dummy-bucket1'
        },
        {
          id: 2,
          name: 'dev-dummy-bucket2'
        },
        {
          id: 3,
          name: 'dev-dummy-bucket3'
        },
        {
          id: 4,
          name: 'dev-dummy-bucket4'
        },
        {
          id: 5,
          name: 'dev-dummy-bucket5'
        },
      ]
    });

  }

];


exports.create_app = [
  ensureLoggedIn('/login'),
  function (req, res, next) {
    const app = {
      name: req.body.name,
      description: req.body.description,
      repo_url: req.body.repo_url,
      userapps: [],
    };

    api.add_app(app)
      .then(function (app) {
        res.redirect(routes.url_for('apps.details', {id: app.id}));
      })
      .catch(function(err) {
        if (err.statusCode === 400) {
          res.render('apps/new.html', {
            app: app,
            errors: err.error,
          });
        } else {
          next(err)
        }
      })
  }
];

exports.list_apps = [
  ensureLoggedIn('/'),
  function (req, res, next) {

    api.list_apps()
      .then(function (apps) {

        res.render('apps/list.html', {
          apps: apps
        });
      })
      .catch(next);
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
