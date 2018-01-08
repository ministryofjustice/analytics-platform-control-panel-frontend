const { api } = require('../api_clients/control_panel_api');
const kubernetes = require('../api_clients/kubernetes');
const { User } = require('../models');
const config = require('../config');
const { get_tool_url } = require('../tools/helpers');


exports.home = (req, res, next) => {
  const rstudio_is_deploying = req.session.rstudio_is_deploying;
  req.session.rstudio_is_deploying = false;

  Promise.all([Tool.list(), User.get(req.user.auth0_id)])
    .then(([tools, user]) => {
      res.render('base/home.html', {
        tools,
        get_tool_url,
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
  passport.authenticate('auth0-oidc'),
  (req, res, next) => {
    raven.setContext({user: req.user});

    api.authenticate(req.user);
    kubernetes.api.authenticate(req.user);

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
  api.auth = null;
  req.session.destroy((err) => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};
