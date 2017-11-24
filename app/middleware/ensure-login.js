module.exports = (app, conf, log) => {
  log.info('adding ensure-login');

  const { ensureLoggedIn } = require('connect-ensure-login');
  const { exclude } = require('../config').ensure_login;
  const llog = require('bole')('ensure-login');

  return (req, res, next) => {

    for (let i in exclude) {
      if (req.url.match(exclude[i])) {
        return next();
      }
    }

    return ensureLoggedIn('/login')(req, res, next);
  };
};
