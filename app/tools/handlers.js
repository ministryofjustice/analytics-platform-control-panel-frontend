const { Deployment } = require('../models');
const { url_for } = require('../routes');


exports.restart = (req, res, next) => {
  Deployment.get(req.params.name)
    .then((tool) => {
      req.session.flash_messages.push(`Restarting ${tool.metadata.name}`);
      return tool.restart();
    })
    .then(() => {
      const tools_url = `${url_for('base.home')}#${encodeURIComponent('Analytical tools')}`;

      res.redirect(tools_url);
    })
    .catch(next);
};


exports.deploy = (req, res) => {
  Deployment.create({ tool_name: req.params.name });
  req.session.is_deploying = req.session.is_deploying || {};
  req.session.is_deploying[req.params.name] = true;
  req.session.flash_messages.push(`Deploying '${req.params.name}'...this may take up to 5 minutes`);

  res.redirect(`${url_for('base.home')}#${escape('Analytical tools')}`);
};
