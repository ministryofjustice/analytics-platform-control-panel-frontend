const { Deployment, User } = require('../models');
const config = require('../config');
const cls = require('continuation-local-storage');
const passport = require('passport');
const { url_for } = require('../routes');
const uuid = require('uuid');


exports.home = (req, res, next) => {
  const { rstudio_is_deploying } = req.session;
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  req.session.rstudio_is_deploying = false;

  Promise.all([Deployment.list(), User.get(req.user.auth0_id)])
    .then(([tools, user]) => {
      ns.run(() => {
        res.render('base/home.html', {
          tools,
          rstudio_is_deploying,
          user,
        });
      });
    })
    .catch(next);
};


exports.error_test = (req, res, next) => {
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  if (req.query.forbidden) {
    ns.get('cpanel').authenticate({ id_token: 'invalid token' });
  }
  return User.get('non-existent')
    .catch(next);
};


exports.auth_callback = [
  passport.authenticate('oidc'),
  (req, res) => {
    res.redirect(url_for('users.verify_email'));
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
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  ['cpanel', 'kubernetes'].forEach((api) => {
    const client = ns.get(api);
    if (client) {
      client.auth = null;
    }
  });
  req.session.destroy(() => {
    res.clearCookie(config.session.name);
    res.redirect('/');
  });
};
