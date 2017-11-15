"use strict";

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const api = require('../api-client');
const routes = require('../routes');


exports.create = [
  ensureLoggedIn('/login'),
  (req, res, next) => {
    const user_id = req.body.user_id;
    const bucket_id = req.body.bucket_id;

    const users3bucket = {
      user: user_id,
      s3bucket: bucket_id,
      access_level: 'readonly',
      is_admin: false,
    };

    api.users3buckets.add(users3bucket)
      .then(() => {
        res.redirect(routes.url_for('buckets.details', {id: bucket_id}));
      })
      .catch(next);
  }
];
