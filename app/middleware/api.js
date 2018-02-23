const { ControlPanelAPIClient } = require('../api_clients/control_panel_api');
const { KubernetesAPIClient } = require('../api_clients/kubernetes');
const cls = require('cls-hooked');


module.exports = (app, conf, log) => {
  log.info('adding api');
  return (req, res, next) => {
    const ns = cls.getNamespace(conf.continuation_locals.namespace);

    if (req.user && req.user.id_token) {
      const cpanel = new ControlPanelAPIClient(conf.api);
      cpanel.authenticate(req.user);
      ns.set('cpanel', cpanel);

      const kubernetes = new KubernetesAPIClient(conf.api);
      kubernetes.authenticate(req.user);
      ns.set('kubernetes', kubernetes);
    }
    next();
  };
};
