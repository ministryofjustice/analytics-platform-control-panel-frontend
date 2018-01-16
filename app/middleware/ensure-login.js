const { ensureLoggedIn } = require('connect-ensure-login');
const { exclude } = require('../config').ensure_login;


module.exports = (app, conf, log) => {
  log.info('adding ensure-login');

  return (req, res, next) => {
    if (exclude.find(url => req.url.match(url))) {
      return next();
    }

    return ensureLoggedIn('/login')(req, res, next);
  };
};
