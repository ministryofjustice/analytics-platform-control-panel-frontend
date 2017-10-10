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
