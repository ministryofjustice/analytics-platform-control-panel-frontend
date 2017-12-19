const { Deployment, Tool, ToolDeployment } = require('../models');

const { get_tool_url } = require('./helpers');


exports.list = (req, res, next) => {
  Tool.list()
    .then((tools) => {
      res.render('tools/list.html', { tools, get_tool_url });
    })
    .catch(next);
};


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
    res.redirect(url_for('tools.list'));
  }, 2000);
};
