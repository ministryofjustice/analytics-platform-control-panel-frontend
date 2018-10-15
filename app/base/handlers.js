const cls = require('cls-hooked');
const passport = require('passport');
const request = require('request-promise');
const config = require('../config');
const { Deployment, User, Tool } = require('../models');
const { url_for } = require('../routes');


function sso_logout_url() {
  const returnTo = encodeURI(`${config.app.protocol}://${config.app.host}`);
  return `https://${config.auth0.domain}${config.auth0.sso_logout_url}?returnTo=${returnTo}&client_id=${config.auth0.clientID}`;
}

function get_tools_context(deployed_tools, deployable_tools) {
  const deployed_app_labels = new Set(deployed_tools.map(x => x.app_label));
  return {
    tools: deployed_tools,
    deployable_tools: deployable_tools.filter(x => !deployed_app_labels.has(x.name)),
  };
}

exports.home = (req, res, next) => {
  const { is_deploying } = req.session;
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  req.session.is_deploying = {};

  Promise.all([Deployment.list(), User.get(req.user.auth0_id), Tool.list()])
    .then(([tools, user, deployable_tools]) => {
      ns.run(() => {
        const buckets = user.users3buckets.reduce((groupedBuckets, bucket) => {
          const group = bucket.s3bucket.is_data_warehouse ? 'warehouse' : 'webapp';
          groupedBuckets[group] = groupedBuckets[group] || [];
          groupedBuckets[group].push(bucket);
          return groupedBuckets;
        }, {});
        const grafana_url = encodeURI(`${config.grafana.dashboard_url}&var-Username=${user.username}`);
        res.render('base/home.html', {
          ...get_tools_context(tools, deployable_tools),
          is_deploying,
          user,
          buckets,
          grafana_url,
        });
      });
    })
    .catch(next);
};

exports.tools = (req, res, next) => {
  const { is_deploying } = req.session;
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  req.session.is_deploying = {};

  Promise.all([Deployment.list(), Tool.list()])
    .then(([tools, deployable_tools]) => {
      ns.run(() => {
        res.render('tools/includes/list.html', {
          ...get_tools_context(tools, deployable_tools),
          is_deploying,
        });
      });
    })
    .catch(next);
};


exports.whats_new = (req, res, next) => {
  request(config.whats_new.url)
    .then((markdown_body) => {
      res.render('base/whats-new.html', {
        markdown_body,
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
