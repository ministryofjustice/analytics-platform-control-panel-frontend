const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');

const user = require('../fixtures/user');


describe('users3buckets.update', () => {
  it('patches the specified users3bucket', () => {
    const users3bucket_id = 42;
    const data_access_level = 'readonly';
    const redirect_to = 'buckets/123';

    const patchData = {
      id: users3bucket_id,
      access_level: data_access_level,
      is_admin: false,
    };

    const patch_users3buckets = mock_api()
      .patch(`/users3buckets/${users3bucket_id}/`, patchData)
      .reply(201);

    const get_user = mock_api()
      .get(`/users/${escape(user.auth0_id)}/`)
      .reply(200, user);

    const req = {
      user,
      body: {
        redirect_to,
        data_access_level,
      },
      params: { id: users3bucket_id },
      session: {
        passport: {
          user: {}
        }
      },
    };

    return dispatch(handlers.update, req)
      .then(({ redirect_url }) => {
        assert(get_user.isDone());
        assert(patch_users3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
