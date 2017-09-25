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
