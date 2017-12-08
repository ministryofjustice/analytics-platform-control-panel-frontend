module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      const { api } = require('../api-client');
      const k8s = require('../k8s-api-client');
      api.auth.set_token(req.user.id_token);
      k8s.api.namespace = k8s.get_namespace(req.user.username);
      k8s.api.auth.set_token(req.user.id_token);
    }
    next();
  };
};
