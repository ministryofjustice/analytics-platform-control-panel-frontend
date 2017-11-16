module.exports = (app, conf, log) => {
  log.debug('adding session');
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const session_config = Object.assign(
    {store: new RedisStore(conf.session_store)},
    conf.session);
  const session_middleware = session(session_config);

  return (req, res, next) => {
    let tries = 3;

    function lookup_session(error) {

      if (error) {
        return next(error);
      }

      tries -= 1;

      if (req.session !== undefined) {
        return next();
      }

      if (tries < 0) {
        return next(new Error('session lookup failed'));
      }

      session_middleware(req, res, lookup_session);
    }

    lookup_session();
  };

};
