"use strict";
const assert = require('chai').assert;
const config = require('../app/config');
const mock = require('./mock');
const nock = require('nock');
const views = require('../app/base/views');


describe('Logging in', () => {

  describe('an authenticated user', () => {

    it('fetches the API user details', () => {
      var next_url = '/';
      var id_token = 'test-token'
      var sub = 'github|12345';

      var user = {
        'auth0_id': sub,
        'url': 'http://localhost:8000/users/github%7C12345/',
        'username': 'test',
        'name': 'Test User',
        'email': 'test@example.com',
        'groups': [],
        'userapps': [],
        'users3buckets': []
      };

      var request = new Promise((resolve, reject) => {
        var req = {
          user: {id_token: id_token, sub: sub},
          session: {returnTo: next_url}
        };
        var res = {redirect: resolve};
        views.auth_callback[1](req, res, reject);
      });

      var user_details_request = mock.api
        .get(`/users/${escape(user.auth0_id)}/`)
        .matchHeader('Authorization', `JWT ${id_token}`)
        .reply(200, user);

      return request
        .then((redirect_url) => {
          assert.equal(redirect_url, next_url);
          assert(user_details_request.isDone(), 'API call expected');
        });
    });

  });

});
