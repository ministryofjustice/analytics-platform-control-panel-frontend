const { api } = require('../api_clients/control_panel_api');
const kubernetes = require('../api_clients/kubernetes');
const { Deployment, User } = require('../models');
const config = require('../config');
const passport = require('passport');
const raven = require('raven');
const { url_for } = require('../routes');
const uuid = require('uuid');


exports.home = (req, res, next) => {
  const { rstudio_is_deploying } = req.session;
  req.session.rstudio_is_deploying = false;

  Promise.all([Deployment.list(), User.get(req.user.auth0_id)])
    .then(([tools, user]) => {
      res.render('base/home.html', {
        tools,
        rstudio_is_deploying,
        user,
      });
    })
    .catch(next);
};


exports.error_test = (req, res, next) => {
  if (req.query.forbidden) {
    api.authenticate({ id_token: 'invalid token' });
  }
  return User.get('non-existent')
    .catch(next);
};


exports.auth_callback = [
  passport.authenticate('oidc'),
  (req, res, next) => {
    raven.setContext({ user: req.user });

    api.authenticate(req.user);
    kubernetes.api.authenticate(req.user);

    User.get(req.user.auth0_id)
      .then((user) => {
        req.user.data = Object.assign(req.user.data, user.data);

        if (!user.email_verified) {
          res.redirect(url_for('users.verify_email', { id: user.auth0_id }));
        } else {
          res.redirect(req.session.returnTo || '/');
        }
      })
      .catch(next);
  },
];

exports.login = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (/^http/.test(req.session.returnTo)) {
      throw new Error('URL must be relative');
    } else {
      res.redirect(req.session.returnTo);
    }
  } else {
    passport.authenticate('oidc', {
      state: uuid(),
    })(req, res, next);
  }
};

exports.logout = (req, res) => {
  req.logout();
  api.auth = null;
  req.session.destroy(() => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};
