const { User } = require('../models');
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

exports.details = (req, res, next) => {
  User.get(req.params.id)
    .then((user) => {
      res.render('users/details.html', {
        signedInUser: user.auth0_id === req.user.auth0_id,
        user,
      });
    })
    .catch(next);
};


exports.update = (req, res, next) => {
  User.get(req.params.id)
    .then((user) => {
      user.is_superuser = !!req.body.superadmin;

      return user.update()
        .then(() => {
          req.session.flash_messages.push('User updated');

          let url = url_for('users.details', { id: user.auth0_id });

          if (user.auth0_id === req.user.auth0_id) {
            // force re-login
            url = url_for('base.logout');
          }

          res.redirect(url);
        })
        .catch(next);
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


exports.reset_mfa = (req, res, next) => {
  const user = new User({ auth0_id: req.params.id });
  user.reset_mfa()
    .then(() => {
      req.session.flash_messages.push('User MFA reset');
      res.redirect(url_for('users.details', { id: user.auth0_id }));
    })
    .catch(next);
};
