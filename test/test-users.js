"use strict";
var assert = require('chai').assert;
var nock = require('nock');

var users = require('../app/api-client.js').users;


var mock_api = nock('http://localhost:8000');


describe('Users API', function () {

  describe('list_users', function () {

    it('returns a list of users', function () {
      var response = require('./test-users-response');

      mock_api
        .get('/users')
        .reply(200, response);

      return users.list()
        .then(function (users) { assert.deepEqual(users, response); });
    });

  });


  describe('add_user', function () {

    it('throws an error if no user data is provided', function () {
      var error = {
        "username": ["This field is required."],
        "userapps": ["This field is required."],
        "users3buckets": ["This field is required."]
      }

      mock_api
        .post('/users', JSON.stringify({}))
        .reply(400, error);

      return users.add({})
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('throws an error if incomplete user data is provided', function () {
      var incomplete_user_data = {'username': 'test-user'};

      var error = {
        "userapps": ["This field is required."],
        "users3buckets": ["This field is required."]
      }

      mock_api
        .post('/users', JSON.stringify(incomplete_user_data))
        .reply(400, error);

      return users.add(incomplete_user_data)
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('returns a user object after creating the user', function () {

      var test_user = {
        'auth0_id': 'github|12345',
        'username': 'test-user',
        'name': 'Test User',
        'email': 'test@example.com'
      };

      var response = {
        "auth0_id": test_user.auth0_id,
        "url": "http://localhost:8000/users/" + escape(test_user.auth0_id) + "/",
        "username": test_user.username,
        "name": test_user.name,
        "email": test_user.email,
        "groups": [],
        "userapps": [],
        "users3buckets": []
      };

      mock_api
        .post('/users', JSON.stringify(test_user))
        .reply(201, response);

      return users.add(test_user)
        .then(function (user) { assert.deepEqual(user, response); });
    });

  });

});
