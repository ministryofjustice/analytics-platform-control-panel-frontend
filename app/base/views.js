const api = require('../api-client');
const config = require('../config');
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const raven = require('raven');
const routes = require('../routes');


exports.home = [
  ensureLoggedIn('/login'),
  function (req, res, next) {
    res.render('home.html');
  }
];


exports.error_test = function (req, res, next) {
  api.users.get('non-existent')
    .then(function (user) { res.send(user.id); })
    .catch(next);
};


exports.auth_callback = [
  passport.authenticate('auth0-oidc'),

  function (req, res, next) {
    raven.setContext({user: req.user});
    api.set_token(req.user.id_token);

    api.users.get(req.user.sub)

      .then((user) => {
        req.user.is_superuser = true;
        res.redirect(req.session.returnTo || '/');
      })

      .catch((error) => {
        if (error.statusCode && error.statusCode == 403) {
          req.user.is_superuser = false;
          res.redirect('/');

        } else {
          next(error);
        }
      });
  }
];

exports.login = function (req, res) {
  res.render('login.html', {
    env: process.env,
    session: req.session
  });
};

exports.logout = function (req, res) {
  req.logout();
  api.unset_token();
  req.session.destroy(err => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};
