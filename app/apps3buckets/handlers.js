const { ensureLoggedIn } = require('connect-ensure-login');

const api = require('../api-client');
const routes = require('../routes');


exports.create = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const { app_id, bucket_id } = req.body;

    const apps3bucket = {
      app: app_id,
      s3bucket: bucket_id,
      access_level: 'readonly',
    };

    api.apps3buckets.add(apps3bucket)
      .then(() => {
        res.redirect(routes.url_for('apps.details', { id: app_id }));
      })
      .catch(next);
  },
];

exports.update = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const apps3bucket_id = req.params.id;
    const { access_level, redirect_to } = req.body;

    const apps3bucket = {
      id: apps3bucket_id,
      access_level: access_level,
    };

    api.apps3buckets.update(apps3bucket)
      .then(() => {
        res.redirect(redirect_to);
      })
      .catch(next);
  },
];

exports.delete = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    api.apps3buckets.delete(req.params.id)
      .then(() => {
        res.redirect(req.body.redirect_to);
      })
      .catch(next);
  },
];
