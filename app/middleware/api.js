module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      const cpanel = require('../api_clients/control_panel_api'); // eslint-disable-line global-require
      const kubernetes = require('../api_clients/kubernetes'); // eslint-disable-line global-require
      cpanel.api.authenticate(req.user);
      kubernetes.api.authenticate(req.user);
    }
    next();
  };
};
