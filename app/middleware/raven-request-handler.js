const raven = require('raven');


module.exports = (app, conf, log) => {
  log.info('adding raven request handler');
  raven.config(conf.sentry.dsn, conf.sentry.options).install();
  return raven.requestHandler();
};
