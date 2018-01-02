module.exports = (app, conf, log) => {
  if (conf.log.requests) {
    log.info('adding request-logging');
    return require('morgan')('combined', { // eslint-disable-line global-require
      skip: req => req.query.healthz !== undefined,
    });
  }
  return (req, res, next) => { next(); };
};
