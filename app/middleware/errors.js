module.exports = (app, conf, log) => {
  log.info('adding errors');

  const sentry = require('raven'); // eslint-disable-line global-require
  const errlog = require('bole')('error-handler'); // eslint-disable-line global-require

  process.on('unhandledRejection', (error) => {
    errlog.error(error.message);
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
  };
};
