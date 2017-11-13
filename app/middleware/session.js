module.exports = (app, conf, log) => {
  log.debug('adding session');
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const session_config = Object.assign(
    {store: new RedisStore(conf.session_store)},
    conf.session);
  return session(session_config);
};
