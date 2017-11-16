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
    let log = require('bole')('oidc-callback');

    log.debug('authenticated');

    raven.setContext({user: req.user});
    api.set_token(req.user.id_token);

    log.debug(`fetching user ${req.user.sub} from api`);
    api.users.get(req.user.sub)

      .then((user) => {
        log.debug(`got user from api`);
        req.user.is_superuser = true;
        log.debug(`redirecting to ${req.session.returnTo || '/'}`);
        res.redirect(req.session.returnTo || '/');
      })

      .catch((error) => {
        log.debug('error fetching user');
        log.debug(error);
        if (error.statusCode && error.statusCode == 403) {
          log.debug('api permission denied - user not superuser');
          req.user.is_superuser = false;
          log.debug('redirecting to friendly error message');
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
  req.session.destroy((err) => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};