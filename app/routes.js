var config = require('./config');
var log = require('bole')('routes');
var express = require('express');
var join = require('path').join;


exports.router = new express.Router();

var routes = [].concat.apply([], config.apps.map(add_app_routes));

exports.url_for = function (view_name, args) {

  for (var i = 0, l = routes.length; i < l; i++) {
    var route = routes[i];

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


function add_app_routes(app_name) {

  var routes = join(__dirname, app_name, 'routes.js');

  return require(routes).map(add_route(app_name));
}


function add_route(app_name) {
  return function (route) {
    route.name = app_name + '.' + route.name;

    log.debug(route.name + ': ' + route.pattern);

    exports.router.all(route.pattern, route.view);

    return route;
  };
}

// static routes
Object.keys(config.static.paths).forEach(function (pattern) {
  var source_paths = config.static.paths[pattern];

  source_paths.forEach(function (path) {

    exports.router.use(pattern, express.static(path));
  });
});


exports.router.use(function (req, res) {
  res.status(404).render('errors/not-found.html');
});
