const raven = require('raven');


module.exports = (app, conf, log) => {
  log.info('adding raven-errorhandler');
  return raven.errorHandler();
};
