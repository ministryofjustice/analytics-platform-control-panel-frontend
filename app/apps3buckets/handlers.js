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
