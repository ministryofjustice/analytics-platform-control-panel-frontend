require('dotenv').config();
var bole = require('bole');
var config = require('./config.js');
var express = require('express');
var join = require('path').join;
var nunjucks = require('nunjucks');
var passport = require('passport');
var raven = require('raven');
var Strategy = require('passport-auth0-openidconnect').Strategy;
var assets = require('./assets');


var app = express();
app.set('views', __dirname);

raven.config(config.sentry.dsn, config.sentry.options).install();
app.use(raven.requestHandler());

bole.output({level: config.log.level, stream: process.stdout});
app.use(require('morgan')('combined'));

if (process.env.ENV !== 'prod') {
  assets.compile_sass();
  assets.compile_js();
}

nunjucks.configure(join(__dirname, 'templates'), {
  autoescape: true,
  express: app
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')(config.session));

passport.use(new Strategy(
  config.auth0,
  (req, issuer, audience, profile, accessToken, refreshToken, params, cb) => {
    profile._json.id_token = params.id_token;
    return cb(null, profile._json);
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  app.locals.req = req;
  app.locals.current_user = req.user || null;
  app.locals.env = process.env;
  next();
});

var routes = require('./routes');
app.use(routes.router);

app.use(raven.errorHandler());

app.use(require('./errors'));

app.locals.asset_path = '/static/';

app.locals.url_for = routes.url_for;

module.exports = app;
