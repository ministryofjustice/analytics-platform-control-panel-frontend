module.exports = (app, conf, log) => {
  if (conf.log.ENABLE_ACCESS_LOGS) {
    log.debug('adding request-logging');
    return require('morgan')('combined');
  }
  return (req, res, next) => { next(); };
};
