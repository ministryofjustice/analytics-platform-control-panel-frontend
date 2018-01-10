module.exports = (app, conf, log) => {
  log.info('adding ensure-login');

  const { ensureLoggedIn } = require('connect-ensure-login'); // eslint-disable-line global-require
  const { exclude } = require('../config').ensure_login; // eslint-disable-line global-require

  return (req, res, next) => {
    if (exclude.find(url => req.url.match(url))) { return next(); }

    return ensureLoggedIn('/login')(req, res, next);
  };
};
