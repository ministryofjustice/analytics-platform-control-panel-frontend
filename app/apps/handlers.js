const { ensureLoggedIn } = require('connect-ensure-login');
const { App, Bucket, User } = require('../api-client');


exports.new = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    Bucket.list()
      .then((buckets) => {
        res.render('apps/new.html', {
          prefix: `${process.env.ENV}-`,
          buckets,
        });
      })
      .catch(next);
  },
];


exports.create = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const app = new App({
      name: req.body.name,
      description: req.body.description,
      repo_url: req.body.repo_url,
      userapps: [],
    });

    app.create()
      .then((new_app) => {
        const { url_for } = require('../routes'); // eslint-disable-line global-require
        res.redirect(url_for('apps.details', { id: new_app.id }));
      })
      .catch((err) => {
        if (err.statusCode === 400) {
          res.render('apps/new.html', {
            app,
            errors: err.error,
          });
        } else {
          next(err);
        }
      });
  },
];

exports.list = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    App.list()
      .then((apps) => {
        res.render('apps/list.html', { apps });
      })
      .catch(next);
  },
];


exports.details = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    Promise.all([App.get(req.params.id), Bucket.list(), User.list()])
      .then(([app, buckets, users]) => {
        res.render('apps/details.html', {
          app,
          buckets_options: buckets.exclude(app.buckets),
          users,
        });
      })
      .catch(next);
  },
];


exports.delete = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    App.delete(req.params.id)
      .then(() => {
        const { url_for } = require('../routes'); // eslint-disable-line global-require
        res.redirect(url_for('apps.list'));
      })
      .catch(next);
  },
];
