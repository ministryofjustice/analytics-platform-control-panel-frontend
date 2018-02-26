module.exports = (app, conf, log) => {
  log.info('adding template-locals');
  return (req, res, next) => {
    res.locals.asset_path = conf.app.asset_path;
    res.locals.current_user = req.user;
    res.locals.env = process.env;
    res.locals.req = req;
    next();
  };
};
