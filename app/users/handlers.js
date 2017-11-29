const { App, Bucket, User } = require('../models');


exports.list_users = (req, res, next) => {
  User.list()
    .then((users) => {
      res.render('users/list.html', { users });
    })
    .catch(next);
};

exports.new_user = (req, res) => { res.render('users/new.html'); };

exports.user_details = (req, res, next) => {
  User.get(req.params.id)
    .then((user) => {
      res.render('users/details.html', {
        signedInUser: user.auth0_id === req.user.auth0_id,
        user,
      });
    })
    .catch(next);
};


exports.edit = (req, res, next) => {
  Promise.all([User.get(req.params.id), App.list(), Bucket.list()])
    .then(([user, apps, buckets]) => {
      res.render('users/edit.html', {
        user,
        apps_options: apps.exclude(user.apps),
        buckets_options: buckets.exclude(user.buckets),
      });
    })
    .catch(next);
};


exports.verify_email = (req, res, next) => {
  User.get(req.params.id)
    .then((user) => {
      if (req.method == 'POST') {
        user.email = req.body['email'];
        user.verified_email = true;

        return user.update()
          .then(() => {
            req.session.flash_messages.push("Updated email address");
            res.redirect(req.session.returnTo || '/');
          })
          .catch(next);
      }

      res.render('users/verify_email.html', { user });
    })
    .catch(next);
};
