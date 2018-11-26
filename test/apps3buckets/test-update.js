const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/apps3buckets/handlers');


describe('apps3buckets.update', () => {
  it('patches the specified apps3bucket', () => {
    const apps3bucket = {
      id: 42,
      app_id: 1,
      s3bucket_id: 1,
      access_level: 'readwrite'
    };
    const access_level = 'readonly';
    const redirect_to = 'apps/123';

    const get_apps3bucket = mock_api()
      .get(`/apps3buckets/${apps3bucket.id}/`)
      .reply(200, apps3bucket);
    const patch_apps3buckets = mock_api()
      .patch(`/apps3buckets/${apps3bucket.id}/`, {
        id: apps3bucket.id,
        app_id: apps3bucket.app_id,
        s3bucket_id: apps3bucket.s3bucket_id,
        access_level,
      })
      .reply(201);

    const params = { id: apps3bucket.id };
    const body = { access_level, redirect_to };

    return dispatch(handlers.update, { params, body })
      .then(({ redirect_url }) => {
        assert(get_apps3bucket.isDone());
        assert(patch_apps3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
