module.exports = (app, conf, log) => {
  log.info('adding session');
  const session = require('express-session'); // eslint-disable-line global-require
  const RedisStore = require('connect-redis')(session); // eslint-disable-line global-require
  const session_config = Object.assign(
    { store: new RedisStore(conf.session_store) },
    conf.session,
  );
  const redislog = require('bole')('redis'); // eslint-disable-line global-require
  redislog.debug(`connecting to ${conf.session_store.host}:${conf.session_store.port}`);
  session_config.store.logErrors = redislog.error;
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

      return session_middleware(req, res, lookup_session);
    }

    lookup_session();
  };
};
