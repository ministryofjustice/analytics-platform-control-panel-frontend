const { UserS3Bucket, User } = require('../models');
const { url_for } = require('../routes');


exports.create = (req, res, next) => {
  const { user_id, bucket_id, data_access_level } = req.body;
  let access_level = 'readonly';
  let is_admin = false;

  if (data_access_level !== 'readonly') {
    access_level = 'readwrite';
  }
  if (data_access_level === 'admin') {
    is_admin = true;
  }

  new UserS3Bucket({
    user: user_id,
    s3bucket: bucket_id,
    access_level,
    is_admin,
  })
    .create()
    .then(() => User.get(req.user.auth0_id))
    .then((user) => {
      req.session.passport.user.users3buckets = user.data.users3buckets;
    })
    .then(() => {
      res.redirect(url_for('buckets.details', { id: bucket_id }));
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const users3bucket_id = req.params.id;
  const { redirect_to, data_access_level } = req.body;
  let access_level = 'readonly';
  let is_admin = false;

  if (data_access_level === 'admin') {
    is_admin = true;
  }
  if (data_access_level !== 'readonly') {
    access_level = 'readwrite';
  }

  new UserS3Bucket({
    id: users3bucket_id,
    access_level,
    is_admin,
  })
    .update()
    .then(() => User.get(req.user.auth0_id))
    .then((user) => {
      req.session.passport.user.users3buckets = user.data.users3buckets;
    })
    .then(() => { res.redirect(redirect_to); })
    .catch(next);
};

exports.delete = (req, res, next) => {
  UserS3Bucket.delete(req.params.id)
    .then(() => User.get(req.user.auth0_id))
    .then((user) => {
      req.session.passport.user.users3buckets = user.data.users3buckets;
    })
    .then(() => { res.redirect(req.body.redirect_to); })
    .catch(next);
};
