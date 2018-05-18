const sentry = require('raven');
const errlog = require('bole')('error-handler');


const handle_state_mismatch = (req, res, conf) => {
  errlog.info('Handling "state mismatch" error by redirecting user to login page...');

  req.session.destroy(() => {
    res.clearCookie(conf.session.name);
    res.redirect('/login');
  });
};

module.exports = (app, conf, log) => {
  log.info('adding errors');

  process.on('unhandledRejection', (error) => {
    errlog.error(error);
    sentry.captureException(error);
  });

  return (err, req, res, next) => {
    errlog.error(err);

    if (err.message.startsWith('state mismatch')) {
      handle_state_mismatch(req, res, conf);
      return true;
    }

    sentry.captureException(err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500);
    res.render('errors/internal-error.html', { error: err });

    return true;
  };
};
