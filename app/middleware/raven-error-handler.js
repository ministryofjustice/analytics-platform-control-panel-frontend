module.exports = (app, conf, log) => {
  log.debug('adding raven-errorhandler');
  const raven = require('raven');
  return raven.errorHandler();
};
