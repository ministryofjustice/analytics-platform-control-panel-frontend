var config = require('./config');
var log = require('bole')('routes');
var express = require('express');
var join = require('path').join;


exports.router = new express.Router();

exports.routes = [].concat.apply([], config.apps.map(add_app_routes));


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
