const { Deployment, Pod, User } = require('../models');


exports.list = (req, res, next) => {
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
      res.render('tools/list.html', { tools });
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