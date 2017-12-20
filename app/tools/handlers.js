const { Deployment, ToolDeployment } = require('../models');


exports.restart = (req, res, next) => {
  Deployment.get(req.params.name)
    .then((tool) => {
      req.session.flash_messages.push(`Restarting ${tool.metadata.name}`);
      return tool.restart();
    })
    .then(() => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      res.redirect(url_for('base.home', { fragment: 'Analytical tools' }));
    })
    .catch(next);
};


exports.deploy = (req, res, next) => {
  const { url_for } = require('../routes'); // eslint-disable-line global-require

  new ToolDeployment({ tool_name: req.params.name }).create();

  req.session.flash_messages.push(`Deploying '${req.params.name}'...this may take up to 5 minutes`);
  setTimeout(() => {
    res.redirect(url_for('base.home', { fragment: 'Analytical tools' }));
  }, 2000);
};
