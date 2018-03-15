const { Deployment, User } = require('../models');
const config = require('../config');
const cls = require('cls-hooked');
const passport = require('passport');
const { url_for } = require('../routes');
const uuid = require('uuid');


function sso_logout_url() {
  const returnTo = encodeURI(`${config.app.protocol}://${config.app.host}`);
  return `https://${config.auth0.domain}${config.auth0.sso_logout_url}?returnTo=${returnTo}&client_id=${config.auth0.clientID}`;
}

exports.home = (req, res, next) => {
  const { rstudio_is_deploying } = req.session;
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  req.session.rstudio_is_deploying = false;

  Promise.all([Deployment.list(), User.get(req.user.auth0_id)])
    .then(([tools, user]) => {
      ns.run(() => {
        const buckets = user.users3buckets.reduce(function (buckets, bucket) {
          const group = !!bucket.s3bucket.is_data_warehouse ? 'warehouse' : 'webapp';
          buckets[group] = buckets[group] || [];
          buckets[group].push(bucket);
          return buckets;
        }, {});

        res.render('base/home.html', {
          tools,
          rstudio_is_deploying,
          user,
          buckets,
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
  passport.authenticate('oidc', { failureRedirect: '/login?prompt=true' }),
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
      prompt: req.query.prompt || 'none',
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
    res.redirect(sso_logout_url());
  });
};

exports.healthz = (req, res) => {
  res.sendStatus(200);
};
