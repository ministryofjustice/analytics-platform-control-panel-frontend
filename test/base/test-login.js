

const { assert } = require('chai');
const { dispatch, url_for } = require('../conftest');
const handlers = require('../../app/base/handlers');


describe('OIDC callback', () => {
  describe('with authenticated user', () => {
    it('redirects to the verify email form', () => {
      const user = {
        auth0_id: 'github|12345',
        id_token: 'test-token',
        username: 'test',
      };

      return dispatch(handlers.auth_callback[1], { user })
        .then(({ redirect_url }) => {
          assert.equal(redirect_url, url_for('users.verify_email'));
        });
    });
  });
});
