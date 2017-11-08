var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var api = require('../api-client');
var routes = require('../routes');


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
  ensureLoggedIn('/login'),
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


exports.app_details = [
  ensureLoggedIn('/login'),
  function(req, res, next) {
    let app_request = api.get_app(req.params.id);
    let buckets_request = api.list_buckets();
    let users_request = api.list_users();

    Promise
      .all([app_request, buckets_request, users_request])
      .then(function(responses) {
        let [app_response, buckets_response, users_response] = responses;
        const all_buckets = buckets_response.results;
        const bucket_ids_associated = app_response.apps3buckets.map(as => as.s3bucket.id);
        const buckets_other = all_buckets.filter(bucket => {
          return bucket_ids_associated.indexOf(bucket.id) < 0;
        });
        let template_args = {
          app: app_response,
          available_buckets: buckets_other,
          users: users_response.results,
        };
        res.render('apps/details.html', template_args);
      })
      .catch(next);
  },
];


exports.connect_bucket = [
  ensureLoggedIn('/login'),
  function(req, res, next) {

    const apps3bucket = {
      app: req.params.app_id,
      s3bucket: req.body.connect_bucket,
      access_level: 'readonly'
    };

    api.add_apps3bucket(apps3bucket)
      .then(function () {
        res.redirect(routes.url_for('apps.details', {id: apps3bucket.app}));
      })
      .catch(next);

  }
];
