module.exports = (app, conf, log) => {
  log.debug('adding errors');

  const sentry = require('raven');
  const errlog = require('bole')('error-handler');

  process.on('unhandledRejection', (error) => {
    errlog.error(error.message);
    sentry.captureException(error);
  });

  return (err, req, res, next) => {
    sentry.captureException(err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500);
    res.render('errors/internal-error.html', {'error': err});
  };
};
