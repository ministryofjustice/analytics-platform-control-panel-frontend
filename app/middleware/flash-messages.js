module.exports = (app, conf, log) => {
  log.info('adding flash-messages');

  return (req, res, next) => {
    if (req.session) {
      if (req.session.flash_messages) {
        app.locals.messages = req.session.flash_messages;
      }
      req.session.flash_messages = [];
    }
    return next();
  };
}
