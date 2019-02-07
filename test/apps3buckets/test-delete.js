const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/apps3buckets/handlers');


describe('apps3buckets.delete', () => {
  it('deletes the specified apps3bucket', () => {
    const apps3bucket_id = 42;
    const redirect_to = 'apps/123';

    const delete_apps3buckets = mock_api()
      .delete(`/apps3buckets/${apps3bucket_id}`)
      .reply(204);

    const params = { id: apps3bucket_id };
    const body = { redirect_to };

    return dispatch(handlers.delete, { params, body })
      .then(({ redirect_url }) => {
        assert(delete_apps3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
