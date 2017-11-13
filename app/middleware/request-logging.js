module.exports = (app, conf, log) => {
  if (conf.app.env !== 'dev') {
    log.debug('adding request-logging');
    return require('morgan')('combined');
  }
  return (req, res, next) => { next(); };
};
