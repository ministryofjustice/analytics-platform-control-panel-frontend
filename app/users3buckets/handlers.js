const { ensureLoggedIn } = require('connect-ensure-login');

const api = require('../api-client');
const routes = require('../routes');


exports.create = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const { user_id, bucket_id } = req.body;

    const users3bucket = {
      user: user_id,
      s3bucket: bucket_id,
      access_level: 'readonly',
      is_admin: false,
    };

    api.users3buckets.add(users3bucket)
      .then(() => {
        res.redirect(routes.url_for('buckets.details', { id: bucket_id }));
      })
      .catch(next);
  },
];

exports.update = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const users3bucket_id = req.params.id;
    const { access_level, redirect_to } = req.body;

    const users3bucket = {
      id: users3bucket_id,
      access_level: access_level,
    };

    api.users3buckets.update(users3bucket)
      .then(() => {
        res.redirect(redirect_to);
      })
      .catch(next);
  },
];

exports.delete = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    api.users3buckets.delete(req.params.id)
      .then(() => {
        res.redirect(req.body.redirect_to);
      })
      .catch(next);
  },
];
