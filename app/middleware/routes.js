module.exports = (app, conf, log) => {
  log.info('adding routes');
  const routes = require('../routes'); // eslint-disable-line global-require
  app.locals.url_for = routes.url_for;
  return routes.router;
};
