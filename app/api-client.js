var log = require('bole')('api-client');
var config = require('../app/config');
var request = require('request-promise');
var url = require('url');


module.exports = (function () {

  var token = 'invalid token';

  function api_request(options) {
    return request(override_defaults(options));
  }


  function override_defaults(options) {

    var defaults = {
      method: 'GET',
      uri: endpoint_url(options.endpoint),
      headers: {
        'Authorization': jwt_auth(),
      },
      body: options.resource,
      json: true
    };

    return Object.assign(defaults, options);
  }


  function endpoint_url(endpoint) {
    return url.resolve(config.api.base_url, '/' + (endpoint || ''));
  }


  function basic_auth() {
    return 'Basic ' + new Buffer(
      config.api.username + ':' + config.api.password).toString('base64');
  }


  function jwt_auth() {
    return 'JWT ' + token;
  }


  var api = {};

  api.set_token = function (jwt) {
    token = jwt;
  };

  api.unset_token = function () {
    token = 'invalid token';
  };

  api.list_users = function () {
    return api_request({endpoint: 'users'});
  };

  api.get_user = function (id) {
    return api_request({endpoint: 'users/' + id});
  };

  api.add_user = function (user) {
    return api_request({method: 'POST', endpoint: 'users', resource: user});
  };

  api.users = {
    list: api.list_users,
    get: api.get_user,
    add: api.add_user
  };

  api.list_apps = function () {
      return api_request({endpoint: 'apps'});
  };

  api.list_user_apps = function (user_id) {
    return api_request({endpoint: 'users/' + user_id + '/apps'});
  };

  api.get_app = function (id) {
    return api_request({endpoint: 'apps/' + id});
  };

  api.add_app = function (app) {
    return api_request({method: 'POST', endpoint: 'apps/', resource: app});
  };

  api.apps = {
    list: api.list_apps,
    get: api.get_app,
    add: api.add_app
  };

  api.list_buckets = function () {
    return api_request({endpoint: 's3buckets'});
  };

  api.list_app_buckets = function (app_id) {
    return api_request({endpoint: 'apps/' + app_id + '/s3buckets'});
  };

  api.list_user_buckets = function (user_id) {
    return api_request({endpoint: 'users/' + user_id + '/s3buckets'});
  };

  api.get_bucket = function (id) {
    return api_request({endpoint: 's3buckets/' + id});
  };

  api.add_bucket = function (bucket) {
    return api_request({method: 'POST', endpoint: 's3buckets', resource: bucket});
  };

  api.buckets = {
    'list': api.list_buckets,
    'get': api.get_bucket,
    'add': api.add_bucket
  };

  return api;

})();
