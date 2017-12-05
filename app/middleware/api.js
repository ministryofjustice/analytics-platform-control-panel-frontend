function sanitize_username(username) {
  let s = username.toLowerCase();
  s = s.replace(/[^a-z0-9]+/, '-');
  s = s.replace(/^[^a-z0-9]*/, '');
  s = s.slice(0, 63);
  s = s.replace(/[^a-z0-9]*$/, '');
  return s;
}


module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      const { api } = require('../api-client');
      const k8s_api = require('../k8s-api-client').api;
      api.auth.set_token(req.user.id_token);
      k8s_api.namespace = `user-${sanitize_username(req.user.username)}`;
    }
    next();
  };
};
