const { App, Bucket, User } = require('../models');


exports.list_buckets = [
  (req, res, next) => {
    Bucket.list()
      .then((buckets) => {
        res.render('buckets/list.html', {buckets: buckets}); })
      .catch(next);
  }
];


exports.new_bucket = [
  (req, res) => {
    res.render('buckets/new.html', { prefix: process.env.ENV + '-' });
  }
];


exports.create_bucket = [
  (req, res, next) => {
    new Bucket({
      name: req.body['new-datasource-name'],
      apps3buckets: []
    })
      .create()
      .then((bucket) => {
        const { url_for } = require('../routes');
        res.redirect(url_for('buckets.details', {id: bucket.id})); })
      .catch((error) => {
        res.render('buckets/new.html', {
          bucket: {name: req.body['new-datasource-name']},
          error: error
        });
      });
  }
];


exports.bucket_details = [
  (req, res, next) => {
    Promise.all([Bucket.get(req.params.id), App.list(), User.list()])
      .then(([bucket, apps, users]) => {
        res.render('buckets/details.html', {
          bucket: bucket,
          apps_options: apps.exclude(bucket.apps),
          users_options: users.exclude(bucket.users),
        });
      })
      .catch(next)
  },
];
