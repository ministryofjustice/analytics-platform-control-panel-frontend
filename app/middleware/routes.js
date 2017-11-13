module.exports = (app, conf, log) => {
  log.debug('adding routes');
  const routes = require('../routes');
  app.locals.url_for = routes.url_for;
  return routes.router;
};
