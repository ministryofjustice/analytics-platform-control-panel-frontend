const express = require('express');
const join = require('path').join;

const config = require('./config');


exports.router = new express.Router();

const routes = {};

config.apps.forEach((app_name) => {

  let app_routes = require(join(__dirname, app_name, 'routes'));

  app_routes.forEach((route) => {

    route.name = `${app_name}.${route.name}`;
    route.method = (route.method || 'GET').toLowerCase();

    add_route(route, exports.router);

    routes[route.name] = route;
  });
});


function add_route(route, router) {

  if (!['get', 'post', 'put', 'delete'].includes(route.method)) {
    throw new Error(
      `Invalid method ${route.method.toUpperCase()} in route ${route.name}`);
  }

  router[route.method](route.pattern, route.handler);
}

exports.url_for = function (route_name, args = {}) {
  const route = routes[route_name];

  if (!route) {
    throw new Error(`route ${route_name} not found`);
  }

  try {
    return replace_route_params(route.pattern, args) + query_string(args);

  } catch (error) {
    throw new Error(`url_for("${route_name}") failed: ${error}`);
  }
};

function replace_route_params(pattern, param_values) {

  return pattern.replace(/(?::(\w+))/g, (match, param) => {

    if (!(param in param_values)) {
      throw new Error(`missing value for route parameter "${param}"`);
    }

    let value = param_values[param];

    // remove used values so that the rest can be appended as query string
    delete param_values[param];

    return value;
  });
}


function query_string(args) {

  let pairs = Object.keys(args).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(args[key])}`;
  });

  if (pairs.length === 0) {
    return '';
  }

  return `?${pairs.join('&')}`;
}
