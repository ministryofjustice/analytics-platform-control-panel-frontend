var log = require('bole')('api-client');
var config = require('../app/config');
var request = require('request-promise');
var url = require('url');


exports.list_users = function () {
  return api_request({endpoint: 'users'});
};


exports.get_user = function (id) {
  return api_request({endpoint: 'users/' + id});
};


exports.add_user = function (user) {
  return api_request({method: 'POST', endpoint: 'users', resource: user});
};


exports.users = {
  'list': exports.list_users,
  'get': exports.get_user,
  'add': exports.add_user
};


exports.list_apps = function () {
  return api_request({endpoint: 'apps'});
};


exports.list_user_apps = function (user_id) {
  return api_request({endpoint: 'users/' + user_id + '/apps'});
};


exports.get_app = function (id) {
  return api_request({endpoint: 'apps/' + id});
};


exports.add_app = function (app) {
  return api_request({method: 'POST', endpoint: 'apps', resource: app});
};


exports.apps = {
  'list': exports.list_apps,
  'get': exports.get_app,
  'add': exports.add_app
};


exports.list_buckets = function () {
  return api_request({endpoint: 's3buckets'});
};


exports.list_app_buckets = function (app_id) {
  return api_request({endpoint: 'apps/' + app_id + '/s3buckets'});
};


exports.list_user_buckets = function (user_id) {
  return api_request({endpoint: 'users/' + user_id + '/s3buckets'});
};


exports.get_bucket = function (id) {
  return api_request({endpoint: 's3buckets/' + id});
};


exports.add_bucket = function (bucket) {
  return api_request({method: 'POST', endpoint: 's3buckets', resource: bucket});
};


exports.buckets = {
  'list': exports.list_buckets,
  'get': exports.get_bucket,
  'add': exports.add_bucket
};


function api_request(options) {
  return request(override_defaults(options));
}


function override_defaults(options) {

  var defaults = {
    method: 'GET',
    uri: endpoint_url(options.endpoint),
    headers: {
      'Authorization': basic_auth(),
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
