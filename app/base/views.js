var api = require('../api-client');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var raven = require('raven');


exports.home = [
  ensureLoggedIn('/login'),
  function (req, res) {
    function render(context) {
      res.render('home.html', context);
    }

    api.users.get(req.user.sub)
      .then(function (user) { render({'user': user}); })
      .catch(function (error) { render({'error': error}); });
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
        res.redirect(req.session.returnTo || '/');
      })
      .catch(next);
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
  res.redirect('/');
};
