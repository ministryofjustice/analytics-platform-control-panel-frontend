const { Deployment, User } = require('../models');


exports.list = (req, res, next) => {
  Deployment.list()
    .then((tools) => {
      res.render('tools/list.html', { tools });
    })
    .catch(next);
};


exports.restart = (req, res, next) => {
  Deployment.get(req.params.id)
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
