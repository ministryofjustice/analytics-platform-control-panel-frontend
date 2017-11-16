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
