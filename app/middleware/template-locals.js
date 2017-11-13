module.exports = (app, conf, log) => {
  log.debug('adding template-locals');
  return (req, res, next) => {
    app.locals.asset_path = conf.app.asset_path;
    app.locals.current_user = req.user || null;
    app.locals.env = process.env;
    app.locals.req = req;
    next();
  };
};
