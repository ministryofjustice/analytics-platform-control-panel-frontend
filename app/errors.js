const sentry = require('raven');

const log = require('bole')('error-handler');


process.on('unhandledRejection', (error) => {
  log.error(error.message);
  sentry.captureException(error);
});


module.exports = (err, req, res, next) => {
  sentry.captureException(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.render('errors/internal-error.html', {'error': err});
};
