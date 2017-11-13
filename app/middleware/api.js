module.exports = (app, conf, log) => {
  log.debug('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      const api = require('../api-client');
      api.set_token(req.user.id_token);
    }
    next();
  };
};
