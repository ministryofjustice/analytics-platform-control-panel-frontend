var bole = require('bole');
var passport = require('passport');

exports.home = function (req, res) {
  res.render('home.html', {
    env: process.env,
    session: req.session
  });
};

exports.auth_callback = [
  passport.authenticate('auth0-oidc'),
  function (req, res) {
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
  res.redirect('/');
};
