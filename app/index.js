var bole = require('bole');
require('dotenv').config();
var config = require('./config.js');
var express = require('express');
var join = require('path').join;
var nunjucks = require('nunjucks');


bole.output({level: config.log.level, stream: process.stdout});

var app = express();
app.set('views', __dirname);


nunjucks.configure(join(__dirname, 'templates'), {
  autoescape: true,
  express: app
});


var routes = require('./routes');
app.use(routes.router);

app.use(require('./errors'));


app.locals.url_for = function (view_name, args) {

  var log = bole('url_for');
  log.debug(view_name + ', args: ' + args);

  for (var i = 0, l = routes.routes.length; i < l; i++) {
    var route = routes.routes[i];

    if (route.name === view_name) {
      try {
        return build_url(route.pattern, args);

      } catch (error) {
        throw 'url_for("' + view_name + '") failed: ' + error;
      }
    }
  }

  throw 'route not found for ' + view_name;
};


function build_url(pattern, args) {

  var query = Object.assign({}, args);
  var placeholders = /(\/:\w+\??)/g;

  function matching_argument(match, placeholder) {
    var name = placeholder.replace(/[/:?]/g, '');
    var value = placeholder;

    if (!(name in args)) {
      throw 'missing argument "' + name + '"';
    }

    delete query[name];

    return '/' + args[name];
  }

  var url = pattern.replace(placeholders, matching_argument);

  if (Object.keys(query).length && url.indexOf('?') === -1) {
    url += '?';
  }

  return url + url_params(query);
}


function url_params(query) {
  var pairs = [];

  for (var property in query) {
    if (query.hasOwnProperty(property)) {

      var key = encodeURIComponent(property);
      var val = encodeURIComponent(query[property]);

      pairs.push(key + '=' + val);
    }
  }

  return pairs.join('&');
}


module.exports = app;
