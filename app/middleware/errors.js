const sentry = require('raven');
const errlog = require('bole')('error-handler');


module.exports = (app, conf, log) => {
  log.info('adding errors');

  process.on('unhandledRejection', (error) => {
    errlog.error(error);
    sentry.captureException(error);
  });

  return (err, req, res, next) => {
    errlog.error(err);
    sentry.captureException(err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500);
    res.render('errors/internal-error.html', { error: err });

    return true;
  };
};
