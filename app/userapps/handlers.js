const { App, User, UserApp } = require('../models');
const { url_for } = require('../routes');


function update_current_user(req) {
  return User.get(req.user.auth0_id)
    .then((user) => {
      req.session.passport.user.userapps = user.data.userapps;
    });
}

exports.create = (req, res, next) => {
  const { app_id, user_id } = req.body;

  App.get(app_id)
    .then(app => app.grant_user_access(user_id, 'readonly', true))
    .then(update_current_user(req))
    .then(() => {
      res.redirect(url_for('apps.details', { id: app_id }));
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  const { access_level, redirect_to } = req.body;

  new UserApp({
    id: req.params.id,
    access_level,
  })
    .update()
    .then(update_current_user(req))
    .then(() => {
      res.redirect(redirect_to);
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  UserApp.delete(req.params.id)
    .then(update_current_user(req))
    .then(() => { res.redirect(req.body.redirect_to); })
    .catch(next);
};
