"use strict";
const { assert } = require('chai');
const { mock_api, url_for, withAPI } = require('./conftest');
const { User } = require('../app/models');
const handlers = require('../app/base/handlers');


describe('Logging in', () => {
  describe('an authenticated user', () => {
    it('fetches the API user details', withAPI(() => {
      const auth0_id = 'github|12345';
      const id_token = 'test-token'
      const returnTo = url_for('users.verify_email');
      const username = 'test';

      const user = {
        auth0_id,
        username,
        name: 'Test User',
        email: 'test@example.com',
        url: 'http://localhost:8000/users/github%7C12345/',
        groups: [],
        userapps: [],
        users3buckets: []
      };

      const request = new Promise((resolve, reject) => {
        const req = {
          user: new User({ id_token, auth0_id, username }),
          session: { returnTo }
        };
        const res = { redirect: resolve };
        handlers.auth_callback[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert.equal(redirect_url, returnTo);
        });
    }));
  });
});
