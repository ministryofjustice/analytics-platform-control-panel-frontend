const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');

const user = require('../fixtures/user');


describe('users3buckets.delete', () => {
  it('deletes the specified users3bucket', () => {
    const users3bucket_id = 42;
    const redirect_to = 'users/github|123';

    const delete_users3buckets = mock_api()
      .delete(`/api/cpanel/v1/users3buckets/${users3bucket_id}/`)
      .reply(204);

    const get_user = mock_api()
      .get(`/api/cpanel/v1/users/${escape(user.auth0_id)}/`)
      .reply(200, user);

    const req = {
      user,
      body: { redirect_to },
      params: { id: users3bucket_id },
      session: {
        passport: {
          user: {}
        }
      },
    };

    return dispatch(handlers.delete, req)
      .then(({ redirect_url }) => {
        assert(get_user.isDone());
        assert(delete_users3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
