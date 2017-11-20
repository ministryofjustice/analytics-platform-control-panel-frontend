const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const { App, Bucket, User, api } = require('../api-client');
const routes = require('../routes');


exports.new_app = [
  ensureLoggedIn('/login'),
  function (req, res, next) {
    api.list_buckets()
      .then((buckets_response) => {
        const template_args = {
          prefix: process.env.ENV + '-',
          buckets: buckets_response.results,
        };
        res.render('apps/new.html', template_args);
      })
      .catch(next);
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


const get_buckets_options = (app, buckets) => {
  const associated_ids = app.apps3buckets.map(as => as.s3bucket.id);

  return buckets.filter(bucket => !associated_ids.includes(bucket.id));
};


exports.app_details = [
  ensureLoggedIn('/login'),
  function(req, res, next) {

    Promise
      .all([App.get(req.params.id), Bucket.list(), User.list()])
      .then(function(responses) {
        const [app, buckets, users] = responses;
        const template_args = {
          app: app,
          buckets_options: get_buckets_options(app, buckets),
          users: users
        };
        res.render('apps/details.html', template_args);
      })
      .catch(next);
  },
];


exports.app_delete = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const app_id = req.params.id;

    api.apps.delete(app_id)
      .then(() => {
        res.redirect(routes.url_for('apps.list'));
      })
      .catch(next);
  }
];
