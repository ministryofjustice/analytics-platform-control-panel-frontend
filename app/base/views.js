var api = require('../api-client');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


exports.home = [
  ensureLoggedIn('/login'),
  function (req, res) {
    function render(context) {
      res.render('home.html', context);
    }

    api.authenticate(req.user.id_token);
    api.users.get(req.user.sub)
      .then(function (user) { render({'user': user}); })
      .catch(function (error) { render({'error': error}); });
  }
];


exports.auth_callback = [
  passport.authenticate('auth0-oidc'),
  function (req, res) {
    api.set_token(req.user.id_token);
    res.redirect(req.session.returnTo || '/');
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
