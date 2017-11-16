module.exports = (app, conf, log) => {
  if (conf.log.requests) {
    log.debug('adding request-logging');
    return require('morgan')('combined');
  }
  return (req, res, next) => { next(); };
};
