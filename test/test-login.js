"use strict";
const { assert } = require('chai');
const { mock_api, url_for } = require('./conftest');
const { User } = require('../app/models');
const handlers = require('../app/base/handlers');


describe('Logging in', () => {

  describe('an authenticated user', () => {

    it('fetches the API user details', () => {
      const id_token = 'test-token'
      const auth0_id = 'github|12345';
      const next_url = url_for('users.verify_email', { params: { id: auth0_id } });

      const user = {
        'auth0_id': auth0_id,
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
          user: new User({ id_token, auth0_id }),
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
