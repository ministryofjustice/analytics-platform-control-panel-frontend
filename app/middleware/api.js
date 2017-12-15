module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      const { api } = require('../api_clients/control_panel_api');
      const kubernetes = require('../api_clients/kubernetes');
      api.authenticate({ type: 'jwt', token: req.user.id_token });
      kubernetes.api.namespace = kubernetes.get_namespace(req.user.username);
      kubernetes.api.authenticate({ type: 'jwt', token: req.user.id_token });
    }
    next();
  };
};
