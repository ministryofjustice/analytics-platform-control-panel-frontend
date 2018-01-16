const { Deployment } = require('../models');


exports.restart = (req, res, next) => {
  Deployment.get(req.params.name)
    .then((tool) => {
      req.session.flash_messages.push(`Restarting ${tool.metadata.name}`);
      return tool.restart();
    })
    .then(() => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      const tools_url = `${url_for('base.home')}#${encodeURIComponent('Analytical tools')}`;

      res.redirect(tools_url);
    })
    .catch(next);
};


exports.deploy = (req, res) => {
  const { url_for } = require('../routes'); // eslint-disable-line global-require

  Deployment.create({ tool_name: req.params.name });

  req.session.rstudio_is_deploying = true;
  req.session.flash_messages.push(`Deploying '${req.params.name}'...this may take up to 5 minutes`);

  res.redirect(`${url_for('base.home')}#${escape('Analytical tools')}`);
};
