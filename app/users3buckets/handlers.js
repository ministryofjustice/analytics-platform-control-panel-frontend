const { UserS3Bucket } = require('../models');


exports.create = (req, res, next) => {
  const { user_id, bucket_id } = req.body;

  new UserS3Bucket({
    user: user_id,
    s3bucket: bucket_id,
    access_level: 'readonly',
    is_admin: false,
  })
    .create()
    .then(() => {
      const { url_for } = require('../routes');
      res.redirect(url_for('buckets.details', { id: bucket_id })); })
    .catch(next);
};

exports.update = (req, res, next) => {
  const users3bucket_id = req.params.id;
  const { access_level, redirect_to } = req.body;

  new UserS3Bucket({
    id: users3bucket_id,
    access_level: access_level,
  })
    .update()
    .then(() => { res.redirect(redirect_to); })
    .catch(next);
};

exports.delete = (req, res, next) => {
  UserS3Bucket.delete(req.params.id)
    .then(() => { res.redirect(req.body.redirect_to); })
    .catch(next);
};
