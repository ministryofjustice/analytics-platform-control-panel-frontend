var log = require('bole')('error-handler');
var sentry = require('raven');


process.on('unhandledRejection', function (error) {
  log.error(error.message);
  sentry.captureException(error);
});


module.exports = function (err, req, res, next) {
  sentry.captureException(err);

  if (res.headersSent) {
    return next(err);
  }

  show_error(res, err);
};


function show_error(res, err) {
  res.status(500);
  res.render('errors/internal-error.html', {'error': err});
}
