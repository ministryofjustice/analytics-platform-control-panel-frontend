"use strict";
var assert = require('chai').assert;
var nock = require('nock');

var api = require('../app/api-client');


var test_server = nock('http://localhost:8000');


describe('API Client', function () {

  describe('request', function () {

    it('rejects an invalid auth token', function () {
      var reason = {
        'detail': 'Authentication credentials were not provided.'};

      test_server
        .get('/apps/')
        .matchHeader('Authorization', 'JWT invalid token')
        .reply(403, reason);

      return api.apps.list()
        .then(function (apps) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, reason); });
    });

    it('accepts a valid auth token', function () {
      var valid_token = 'invalid JWT'
      var response = {
        'count': 0,
        'next': null,
        'previous': null,
        'results': []
      };

      test_server
        .get('/apps/')
        .matchHeader('Authorization', 'JWT ' + valid_token)
        .reply(200, response);

      api.set_token(valid_token);

      return api.apps.list()
        .then(function (apps) { assert.deepEqual(apps, response); });
    });

  });

});
