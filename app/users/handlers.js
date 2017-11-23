const { App, Bucket, User } = require('../models');


exports.list_users = (req, res, next) => {
  User.list()
    .then((users) => {
      res.render('users/list.html', {users: users}); })
    .catch(next);
};

exports.new_user = (req, res) => { res.render('users/new.html'); };

exports.user_details = (req, res, next) => {
  User.get(req.params.id)
    .then((user) => {
      res.render('users/details.html', {
        signedInuser: user.auth0_id === req.user.sub,
        user: user,
      }); })
    .catch(next);
};


exports.user_edit = (req, res, next) => {
  Promise.all([User.get(req.params.id), App.list(), Bucket.list()])
    .then(([user, apps, buckets]) => {
      res.render('users/edit.html', {
        user: user,
        apps_options: apps.exclude(user.apps),
        buckets_options: buckets.exclude(user.buckets),
      });
    })
    .catch(next);
};
