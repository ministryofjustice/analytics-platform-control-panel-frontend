const { Bucket, User } = require('../models');
const { url_for } = require('../routes');


exports.list_buckets = (req, res, next) => {
  Bucket.list()
    .then((buckets) => {
      res.render('buckets/list.html', { buckets });
    })
    .catch(next);
};


exports.new_bucket = (req, res) => {
  res.render('buckets/new.html', {
    bucket_prefix: `${process.env.ENV}-`,
    type: req.query.type,
  });
};


exports.create_bucket = (req, res) => {
  new Bucket({
    name: req.body['new-datasource-name'],
    apps3buckets: [],
    is_data_warehouse: req.body.bucket_type === 'warehouse',
  })
    .create()
    .then((bucket) => {
      res.redirect(url_for('buckets.details', { id: bucket.id }));
    })
    .catch((error) => {
      res.render('buckets/new.html', {
        bucket: { name: req.body['new-datasource-name'] },
        bucket_prefix: `${process.env.ENV}-`,
        error,
      });
    });
};


exports.bucket_details = (req, res, next) => {
  Promise.all([Bucket.get(req.params.id), User.list()]) // need to include App.list() in future
    .then(([bucket, users]) => { // need to include apps in future
      res.render('buckets/details.html', {
        bucket,
        users_options: users.exclude(bucket.users),
      }); // need to include apps_options: apps.exclude(bucket.apps) in future
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
      const redirect_to = req.body.redirect || url_for('base.home');
      req.session.flash_messages.push(`Bucket "${bucket_name}" deleted`);
      res.redirect(redirect_to);
    })
    .catch(next);
};


exports.aws = (req, res, next) => {
  Bucket.get(req.params.id)
    .then((bucket) => {
      res.redirect(bucket.location_url);
    })
    .catch(next);
};
