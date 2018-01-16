const { load_routes, router, url_for } = require('../routes');


module.exports = (app, conf, log) => {
  log.info('adding routes');
  load_routes();
  app.locals.url_for = url_for;
  return router;
};
