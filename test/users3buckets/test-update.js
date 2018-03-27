const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');


describe('users3buckets.update', () => {
  it('patches the specified users3bucket', () => {
    const users3bucket_id = 42;
    const data_access_level = 'readonly';
    const redirect_to = 'buckets/123';
    const users3bucket_key = `users3bucket_${users3bucket_id}_data_access_level`;

    const patchData = {
      id: users3bucket_id,
      access_level: data_access_level,
      is_admin: false,
    };

    const patchData = {
      id: users3bucket_id,
      access_level: data_access_level,
      is_admin: false,
    };

    const patch_users3buckets = mock_api()
      .patch(`/users3buckets/${users3bucket_id}/`, patchData)
      .reply(201);

    const params = { id: users3bucket_id };
    const body = { redirect_to, data_access_level };

    return dispatch(handlers.update, { params, body })
      .then(({ redirect_url }) => {
        assert(patch_users3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
