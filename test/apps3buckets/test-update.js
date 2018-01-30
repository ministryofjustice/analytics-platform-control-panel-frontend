const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/apps3buckets/handlers');


describe('apps3buckets.update', () => {
  it('patches the specified apps3bucket', () => {
    const apps3bucket_id = 42;
    const access_level = 'readonly';
    const redirect_to = 'apps/123';

    const patch_apps3buckets = mock_api()
      .patch(`/apps3buckets/${apps3bucket_id}/`, {
        id: apps3bucket_id,
        access_level: access_level,
      })
      .reply(201);

    const params = { id: apps3bucket_id };
    const body = { access_level, redirect_to };

    return dispatch(handlers.update, { params, body })
    return request
      .then(({ redirect_url }) => {
        assert(patch_apps3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
