module.exports = (app, conf, log) => {
  log.info('adding raven-errorhandler');
  const raven = require('raven');
  return raven.errorHandler();
};
