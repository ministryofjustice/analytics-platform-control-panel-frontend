module.exports = (app, conf, log) => {
  if (conf.log.requests) {
    log.debug('adding request-logging');
    return require('morgan')('combined', {
      skip: (req, res) => req.query.healthz !== undefined,
    });
  }
  return (req, res, next) => { next(); };
};
