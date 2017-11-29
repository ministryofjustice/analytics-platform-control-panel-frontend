const passport = require('passport');
const Auth0Strategy = require('passport-auth0-openidconnect').Strategy;
const { User } = require('../models');


module.exports = (app, conf, log) => {
  log.info('adding authentication');

  passport.use(new Auth0Strategy(
    conf.auth0,
    (req, iss, aud, profile, accessToken, refreshToken, params, cb) => {
      return cb(null, new User({
        'auth0_id': profile._json.sub,
        'email': profile._json.email,
        'access_token': accessToken,
        'id_token': params.id_token,
        'refresh_token': refreshToken,
        'is_superuser': false,
        'name': profile._json.name,
        'username': profile._json.nickname,
        'verified_email': false,
      }));
    }));

  passport.serializeUser((user, done) => {
    done(null, user.data);
  });

  passport.deserializeUser((obj, done) => {
    done(null, new User(obj));
  });

  return [
    passport.initialize(),
    passport.session()
  ];
};
