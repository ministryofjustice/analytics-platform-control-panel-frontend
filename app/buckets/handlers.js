const { App, Bucket, User } = require('../models');


exports.list_buckets = (req, res, next) => {
  Bucket.list()
    .then((buckets) => {
      res.render('buckets/list.html', { buckets });
    })
    .catch(next);
};


exports.new_bucket = (req, res) => {
  res.render('buckets/new.html', { bucket_prefix: `${process.env.ENV}-` });
};


exports.create_bucket = (req, res) => {
  new Bucket({
    name: req.body['new-datasource-name'],
    apps3buckets: [],
  })
    .create()
    .then((bucket) => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      res.redirect(url_for('buckets.details', { id: bucket.id }));
    })
    .catch((error) => {
      res.render('buckets/new.html', {
        bucket: { name: req.body['new-datasource-name'] },
        error,
      });
    });
};


exports.bucket_details = (req, res, next) => {
  Promise.all([Bucket.get(req.params.id), App.list(), User.list()])
    .then(([bucket, apps, users]) => {
      const current_user_is_bucket_admin = bucket.has_admin(req.user.auth0_id);
      res.render('buckets/details.html', {
        bucket,
        apps_options: apps.exclude(bucket.apps),
        users_options: users.exclude(bucket.users),
        current_user_id: req.user.auth0_id,
        current_user_is_bucket_admin,
      });
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  let bucket_name;
  Bucket.get(req.params.id)
    .then((bucket) => {
      bucket_name = bucket.name;
      return Bucket.delete(bucket.id);
    })
    .then(() => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      let redirect_to = req.body.redirect || url_for('base.home');
      req.session.flash_messages.push(`Bucket "${bucket_name}" deleted`);
      res.redirect(redirect_to);
    })
    .catch(next);
};
