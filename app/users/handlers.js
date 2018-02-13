const { App, Bucket, User } = require('../models');
const { url_for } = require('../routes');


exports.list_users = (req, res, next) => {
  User.list()
    .then((users) => {
      res.render('users/list.html', {
        users,
      });
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


exports.user_edit = (req, res, next) => {
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
  User.get(req.user.auth0_id)
    .then((user) => {
      req.user.data = Object.assign(req.user.data, user.data);

      if (req.method === 'POST') {
        user.email = req.body.email;
        user.email_verified = true;

        return user.update()
          .then(() => {
            req.session.flash_messages.push('Updated email address');
            res.redirect(req.session.returnTo || '/');
          })
          .catch(next);
      }

      if (user.email_verified) {
        return res.redirect(req.session.returnTo || '/');
      }

      return res.render('users/verify_email.html', { user });
    })
    .catch(next);
};


exports.delete = (req, res, next) => {
  User.delete(req.params.id)
    .then(() => {
      req.session.flash_messages.push('User deleted - may take a few seconds to complete deletion');
      res.redirect(url_for('users.list'));
    })
    .catch(next);
};
