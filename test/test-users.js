"use strict";
require('./conftest.js');
var assert = require('chai').assert;
var nock = require('nock');

var api = require('../lib/api-client.js');


describe('Users API', function () {

  describe('list_users', function () {
    var response = require('./test-users-response');

    beforeEach(function () {
      nock('http://localhost:8000').get('/users').reply(200, response);
    });

    it('returns a list of users', function () {
      var andy = response['results'][0];
      assert.eventually.deepEqual(api.list_users(), response);
    });

  });

});
