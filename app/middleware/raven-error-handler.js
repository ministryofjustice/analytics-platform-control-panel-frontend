module.exports = (app, conf, log) => {
  log.info('adding raven-errorhandler');
  const raven = require('raven'); // eslint-disable-line global-require
  return raven.errorHandler();
};
