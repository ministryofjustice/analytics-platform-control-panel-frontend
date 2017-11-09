const log = require('bole')('middleware');


module.exports = {

  '404': (app, conf) => {
    log.debug('adding 404');
    return (req, res) => {
      res.status(404).render('errors/not-found.html');
    };
  },

  'body-parser': (app, conf) => {
    log.debug('adding body-parser');
    return require('body-parser').urlencoded({extended: true});
  },

  'cookie-parser': (app, conf) => {
    log.debug('adding cookie-parser');
    return require('cookie-parser')();
  },

  'errors': (app, conf) => {
    log.debug('adding errorhandler');
    return require('./errors');
  },

  'express-session': (app, conf) => {
    log.debug('adding express-session');
    const session = require('express-session');
    return session(conf.session);
  },

  'locals': (app, conf) => {
    log.debug('adding template locals');
    return (req, res, next) => {
      app.locals.asset_path = conf.app.asset_path;
      app.locals.current_user = req.user || null;
      app.locals.env = process.env;
      app.locals.req = req;
      next();
    };
  },

  'morgan': (app, conf) => {
    if (conf.app.env !== 'dev') {
      log.debug('adding morgan request logging');
      return require('morgan')('combined');
    }
    return (req, res, next) => { next(); };
  },

  'passport': (app, conf) => {
    log.debug('adding passport');
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
  },

  'raven': (app, conf) => {
    log.debug('adding raven');
    const raven = require('raven');
    raven.config(conf.sentry.dsn, conf.sentry.options).install();
    return raven.requestHandler();
  },

  'raven-errorhandler': (app, conf) => {
    log.debug('adding raven-errorhandler');
    const raven = require('raven');
    return raven.errorHandler();
  },

  'routes': (app, conf) => {
    log.debug('adding routes');
    const routes = require('./routes');
    app.locals.url_for = routes.url_for;
    return routes.router;
  },

  'static': (app, conf) => {
    log.debug('adding static');
    const express = require('express');
    const router = new express.Router();
    Object.keys(conf.static.paths).forEach(pattern => {
      conf.static.paths[pattern].forEach(path => {
        router.use(pattern, express.static(path));
      });
    });
    return router;
  },

};
