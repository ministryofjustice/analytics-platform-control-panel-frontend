const { Deployment, Pod, ToolDeployment, User } = require('../models');

const { tools_domain } = require('../config').cluster;


exports.list = (req, res, next) => {
  const get_tool_url = (tool_name) => {
    return `https://${req.user.username}-${tool_name}.${tools_domain}`;
  }

  Promise.all([Deployment.list(), Pod.list()])
    .then(([tools, pods]) => {
      let tools_lookup = {};

      tools.forEach((tool) => {
        tools_lookup[tool.metadata.labels.app] = tool;
        tool.pods = [];
      });

      pods.forEach((pod) => {
        let tool = tools_lookup[pod.metadata.labels.app];
        if (tool) {
          tool.pods.push(pod);
        }
      });

      return tools;
    })
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
      res.redirect(url_for('tools.list'));
    })
    .catch(next);
};


exports.deploy = (req, res, next) => {
  const { url_for } = require('../routes'); // eslint-disable-line global-require

  new ToolDeployment({tool_name: req.params.name}).create()

  req.session.flash_messages.push(`Deploying '${req.params.name}'...`);
  setTimeout(() => {
    res.redirect(url_for('tools.list'));
  }, 2000);
};
