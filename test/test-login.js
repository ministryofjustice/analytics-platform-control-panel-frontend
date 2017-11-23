"use strict";
const { assert } = require('chai');
const { mock_api } = require('./conftest');
const handlers = require('../app/base/handlers');


describe('Logging in', () => {

  describe('an authenticated user', () => {

    it('fetches the API user details', () => {
      const next_url = '/';
      const id_token = 'test-token'
      const sub = 'github|12345';

      const user = {
        'auth0_id': sub,
        'url': 'http://localhost:8000/users/github%7C12345/',
        'username': 'test',
        'name': 'Test User',
        'email': 'test@example.com',
        'groups': [],
        'userapps': [],
        'users3buckets': []
      };

      const request = new Promise((resolve, reject) => {
        const req = {
          user: {id_token: id_token, sub: sub},
          session: {returnTo: next_url}
        };
        const res = {redirect: resolve};
        handlers.auth_callback[1](req, res, reject);
      });

      const user_details_request = mock_api()
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
