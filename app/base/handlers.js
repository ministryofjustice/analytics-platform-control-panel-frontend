const passport = require('passport');
const raven = require('raven');

const { api } = require('../api-client');
const k8s = require('../k8s-api-client');
const { Tool, User } = require('../models');
const config = require('../config');
const { get_tool_url } = require('../tools/helpers');


exports.home = (req, res, next) => {
  const rstudio_is_deploying = req.session.rstudio_is_deploying;
  req.session.rstudio_is_deploying = false;

  Tool.list()
    .then((tools) => {
      res.render('base/home.html', { tools, get_tool_url, rstudio_is_deploying });
    })
    .catch(next);
};


exports.error_test = (req, res, next) => {
  if (req.query.forbidden) {
    api.auth.set_token('invalid token');
  }
  return User.get('non-existent')
    .catch(next);
};


exports.auth_callback = [
  passport.authenticate('auth0-oidc'),
  (req, res, next) => {
    raven.setContext({user: req.user});

    api.auth.set_token(req.user.id_token);
    k8s.api.auth.set_token(req.user.id_token);

    User.get(req.user.auth0_id)
      .then((user) => {
        req.user.data = Object.assign(req.user.data, user.data);

        if (!user.email_verified) {
          const { url_for } = require('../routes');
          res.redirect(url_for('users.verify_email', { id: user.auth0_id }));
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
