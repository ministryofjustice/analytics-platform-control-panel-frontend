const express = require('express');
const config = require('./config');

exports.router = new express.Router();

const routes = {};

function add_route(route, router) {
  if (!['get', 'post', 'put', 'delete'].includes(route.method)) {
    throw new Error(`Invalid method ${route.method.toUpperCase()} in route ${route.name}`);
  }

  router[route.method](route.pattern, route.handler);
}

function replace_route_params(pattern, param_values) {
  return pattern.replace(/(?::(\w+))/g, (match, param) => {
    if (!(param in param_values)) {
      throw new Error(`missing value for route parameter "${param}"`);
    }

    const value = encodeURIComponent(param_values[param]);

    // remove used values so that the rest can be appended as query string
    delete param_values[param];

    return value;
  });
}

function query_string(args) {
  const pairs = Object.keys(args).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(args[key])}`);

  if (pairs.length === 0) {
    return '';
  }

  return `?${pairs.join('&')}`;
}

exports.url_for = (route_name, args = {}) => {
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

exports.load_routes = () => {
  config.apps.forEach((app_name) => {
    const app_routes = require(`${__dirname}/${app_name}/routes`); // eslint-disable-line global-require

    app_routes.forEach((route) => {
      route.name = `${app_name}.${route.name}`;
      route.method = (route.method || 'GET').toLowerCase();

      add_route(route, exports.router);

      routes[route.name] = route;
    });
  });
};
