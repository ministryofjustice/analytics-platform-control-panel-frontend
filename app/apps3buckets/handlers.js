const { App, AppS3Bucket } = require('../models');


exports.create = [
  (req, res, next) => {
    const { app_id, bucket_id } = req.body;

    App.get(app_id)
      .then((app) => {
        return app.grant_bucket_access(bucket_id, 'readonly');
      })
      .then((_) => {
        const { url_for } = require('../routes');
        res.redirect(url_for('apps.details', { id: app_id }));
      })
      .catch(next);
  },
];

exports.update = [
  (req, res, next) => {
    const { access_level, redirect_to } = req.body;

    new AppS3Bucket({
      id: req.params.id,
      access_level: access_level
    })
      .update()
      .then((_) => {
        res.redirect(redirect_to);
      })
      .catch(next);
  },
];

exports.delete = [
  (req, res, next) => {
    AppS3Bucket.delete(req.params.id)
      .then(() => { res.redirect(req.body.redirect_to); })
      .catch(next);
  },
];
