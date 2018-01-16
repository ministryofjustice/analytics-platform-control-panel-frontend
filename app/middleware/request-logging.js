const morgan = require('morgan');


module.exports = (app, conf, log) => {
  if (conf.log.requests) {
    log.info('adding request-logging');
    return morgan('combined', {
      skip: req => req.query.healthz !== undefined,
    });
  }
  return (req, res, next) => { next(); };
};
