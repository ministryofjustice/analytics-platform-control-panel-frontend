var express = require('express');
var join = require('path').join;
var nunjucks = require('nunjucks');

var app = express();
app.set('views', __dirname);

nunjucks.configure(join(__dirname, 'templates'), {
  autoescape: true,
  express: app
});

app.use(require('./routes'));

app.use(require('./errors'));

module.exports = app;
