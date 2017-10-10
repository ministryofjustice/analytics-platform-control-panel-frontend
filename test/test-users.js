"use strict";
require('./conftest.js');
var assert = require('chai').assert;
var nock = require('nock');

var users = require('../lib/api-client.js').users;


var mock_api = nock('http://localhost:8000');


describe('Users API', function () {

  describe('list_users', function () {

    it('returns a list of users', function () {
      var response = require('./test-users-response');

      mock_api
        .get('/users')
        .reply(200, response);

      assert.eventually.deepEqual(users.list(), response);
    });

  });


  describe('add_user', function () {

    it('throws an error if no user data is provided', function () {

      mock_api
        .post('/users', JSON.stringify({}))
        .reply(400, {'error': 'No user data provided'});

      assert.isRejected(users.add({}));
    });

    it('throws an error if incomplete user data is provided', function () {
      var incomplete_user_data = {'name': 'Test user'};

      mock_api
        .post('/users', JSON.stringify(incomplete_user_data))
        .reply(400, {'error': 'Incomplete user data provided'});

      assert.isRejected(users.add(incomplete_user_data));
    });

    it('returns a user id after creating the user', function () {

      var test_user = {
        'username': 'test-user',
        'name': 'Test User',
        'email': 'test@example.com'
      };

      var response ={
        'id': 1,
        'username': test_user.username,
        'name': test_user.name,
        'email': test_user.email
      };

      mock_api
        .post('/users', JSON.stringify(test_user))
        .reply(201, response);

      assert.eventually.propertyVal(users.add(test_user), 'id', 1);

    });

  });

});
