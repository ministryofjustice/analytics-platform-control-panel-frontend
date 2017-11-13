module.exports = (app, conf, log) => {
  log.debug('adding raven request handler');
  const raven = require('raven');
  raven.config(conf.sentry.dsn, conf.sentry.options).install();
  return raven.requestHandler();
};
