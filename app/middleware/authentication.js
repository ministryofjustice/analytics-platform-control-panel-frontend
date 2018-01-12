const config = require('../config');
const passport = require('passport');
const { User } = require('../models');
const { Issuer, Strategy } = require('openid-client');
const auth_log = require('bole')('authentication middleware');


let client = null;

Issuer.useRequest();

Issuer.defaultHttpOptions = {
  timeout: 5000,
  retries: 2,
};

Issuer.discover(`https://${config.auth0.domain}`)
  .then((issuer) => {
    client = new issuer.Client({
      client_id: config.auth0.clientID,
      client_secret: config.auth0.clientSecret,
    });

    const params = {
      redirect_uri: config.auth0.callbackURL,
    };

    const strategy = new Strategy(
      {
        client,
        params,
        passReqToCallback: config.auth0.passReqToCallback,
      },
      (req, tokenset, userinfo, done) => {
        done(null, new User({
          auth0_id: tokenset.claims.sub,
          access_token: tokenset.access_token,
          id_token: tokenset.id_token,
          refresh_token: tokenset.refresh_token,
          is_superuser: false,
          name: userinfo.name,
          username: userinfo.nickname,
        }));
      }
    );

    passport.use('oidc', strategy);
  })
  .catch((error) => {
    auth_log.error(error);
  });

passport.serializeUser((user, done) => {
  done(null, user.data);
});

passport.deserializeUser((obj, done) => {
  done(null, new User(obj));
});


module.exports = (app, conf, log) => {
  log.info('adding authentication');

  return [
    passport.initialize(),
    passport.session(),
  ];
};
