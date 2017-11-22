"use strict";
const { assert } = require('chai');
const { User, ModelSet } = require('../app/api-client');
const { config, mock_api } = require('./conftest');


describe('Users API', () => {

  describe('list_users', () => {

    it('returns a list of users', () => {
      const response = require('./fixtures/users');

      mock_api()
        .get('/users/')
        .reply(200, response);

      const expected = {
        'users': new ModelSet(User, response.results),
      };

      return User.list()
        .then((users) => { assert.deepEqual(users, expected.users); });
    });

  });


  describe('add_user', function () {

    it('throws an error if no user data is provided', function () {
      const error = {
        "username": ["This field is required."],
        "userapps": ["This field is required."],
        "users3buckets": ["This field is required."]
      }

      mock_api()
        .post('/users/', JSON.stringify({}))
        .reply(400, error);

      return new User({}).create()
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('throws an error if incomplete user data is provided', function () {
      const incomplete_user_data = {'username': 'test-user'};

      const error = {
        "userapps": ["This field is required."],
        "users3buckets": ["This field is required."]
      }

      mock_api()
        .post('/users/', JSON.stringify(incomplete_user_data))
        .reply(400, error);

      return new User(incomplete_user_data).create()
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('returns a user object after creating the user', function () {

      const test_user = {
        'auth0_id': 'github|12345',
        'username': 'test-user',
        'name': 'Test User',
        'email': 'test@example.com'
      };

      const response = {
        "auth0_id": test_user.auth0_id,
        "url": `${config.api.base_url}/users/${escape(test_user.auth0_id)}/`,
        "username": test_user.username,
        "name": test_user.name,
        "email": test_user.email,
        "groups": [],
        "userapps": [],
        "users3buckets": []
      };

      mock_api()
        .post('/users/', JSON.stringify(test_user))
        .reply(201, response);

      const expected = {
        'user': new User(response),
      };

      return new User(test_user).create()
        .then((user) => { assert.deepEqual(user, expected.user); });
    });

  });

});
