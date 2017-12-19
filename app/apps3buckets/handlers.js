const { App, AppS3Bucket } = require('../models');


exports.create = (req, res, next) => {
  const { app_id, bucket_id } = req.body;

  App.get(app_id)
    .then(app => app.grant_bucket_access(bucket_id, 'readonly'))
    .then(() => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      res.redirect(url_for('apps.details', { params: { id: app_id } }));
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const { access_level, redirect_to } = req.body;

  new AppS3Bucket({
    id: req.params.id,
    access_level,
  })
    .update()
    .then(() => {
      res.redirect(redirect_to);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  AppS3Bucket.delete(req.params.id)
    .then(() => { res.redirect(req.body.redirect_to); })
    .catch(next);
};
