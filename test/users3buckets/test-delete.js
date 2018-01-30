const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');


describe('users3buckets.delete', () => {
  it('deletes the specified users3bucket', () => {
    const users3bucket_id = 42;
    const redirect_to = 'users/github|123';

    const delete_users3buckets = mock_api()
      .delete(`/users3buckets/${users3bucket_id}/`)
      .reply(204);

    const params = { id: users3bucket_id };
    const body = { redirect_to };

    return dispatch(handlers.delete, { params, body })
      .then(({ redirect_url }) => {
        assert(delete_users3buckets.isDone());
        assert.equal(redirect_url, redirect_to);
      });
  });
});
