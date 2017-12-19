const { App, UserApp } = require('../models');


exports.create = (req, res, next) => {
  const { app_id, user_id } = req.body;

  App.get(app_id)
    .then(app => app.grant_user_access(user_id, 'readonly', true))
    .then(() => {
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      res.redirect(url_for('apps.details', { params: { id: app_id } }));
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const { access_level, redirect_to } = req.body;

  new UserApp({
    id: req.params.id,
    access_level,
    is_admin,
  })
    .update()
    .then(() => {
      res.redirect(redirect_to);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  UserApp.delete(req.params.id)
    .then(() => { res.redirect(req.body.redirect_to); })
    .catch(next);
};
