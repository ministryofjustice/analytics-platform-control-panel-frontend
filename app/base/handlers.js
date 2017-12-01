const { api } = require('../api-client');
const { User } = require('../models');
const config = require('../config');
const passport = require('passport');
const raven = require('raven');


exports.home = (req, res, next) => {
  if (req.user.is_superuser) {
    res.render('home/superuser.html');
  } else {
    res.render('home/user.html');
  }
};


exports.error_test = (req, res, next) => {
  User.get('non-existent')
    .then((user) => { res.send(user.id); })
    .catch(next);
};


exports.auth_callback = [
  passport.authenticate('auth0-oidc'),
  (req, res, next) => {
    raven.setContext({user: req.user});

    api.auth.set_token(req.user.id_token);

    User.get(req.user.auth0_id)
      .then((user) => {
        req.user.data = Object.assign(req.user.data, user.data);

        if (!user.email_verified) {
          const { url_for } = require('../routes');
          res.redirect(url_for('users.verify_email', {id: user.auth0_id}));
        } else {
          res.redirect(req.session.returnTo || '/');
        }
      })
      .catch(next);
  }
];

exports.login = (req, res) => {
  res.render('login.html', {
    env: process.env,
    session: req.session
  });
};

exports.logout = (req, res) => {
  req.logout();
  api.auth.unset_token();
  req.session.destroy((err) => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};
