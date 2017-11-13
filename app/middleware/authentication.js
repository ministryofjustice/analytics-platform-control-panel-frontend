module.exports = (app, conf, log) => {
  log.debug('adding authentication');
  const passport = require('passport');
  const Auth0Strategy = require('passport-auth0-openidconnect').Strategy;
  passport.use(new Auth0Strategy(
    conf.auth0,
    (req, iss, aud, profile, accessToken, refreshToken, params, cb) => {
      profile._json.id_token = params.id_token;
      return cb(null, profile._json);
    }));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  return [
    passport.initialize(),
    passport.session()
  ];
};
