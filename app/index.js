require('dotenv').config();
var bole = require('bole');
var config = require('./config.js');
var express = require('express');
var join = require('path').join;
var nunjucks = require('nunjucks');
var assets = require('./assets');


bole.output({level: config.log.level, stream: process.stdout});

var app = express();
app.set('views', __dirname);

if (process.env.ENV !== 'prod') {
  assets.compile_sass();
}

nunjucks.configure(join(__dirname, 'templates'), {
  autoescape: true,
  express: app
});

var routes = require('./routes');
app.use(routes.router);

app.use(require('./errors'));

app.locals.asset_path = '/static/';

app.locals.url_for = require('../lib/url_for')(routes.routes);

module.exports = app;
