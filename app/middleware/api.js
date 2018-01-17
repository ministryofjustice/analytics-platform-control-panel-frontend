const cpanel = require('../api_clients/control_panel_api');
const kubernetes = require('../api_clients/kubernetes');


module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    if (req.user && req.user.id_token) {
      cpanel.api.authenticate(req.user);
      kubernetes.api.authenticate(req.user);
    }
    next();
  };
};
