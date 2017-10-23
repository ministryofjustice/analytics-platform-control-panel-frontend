var api = require('../../lib/api-client');
var passport = require('passport');


exports.home = function (req, res) {

  function render(context) {
    res.render('home.html', context);
  }

  if (req.user) {
    api.authenticate(req.user.id_token);
    api.users.get(req.user.sub)
      .then(function (user) { render({'user': user}); })
      .catch(function (error) { render({'error': error}); });

  } else {
    res.redirect('/login');
  }
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
