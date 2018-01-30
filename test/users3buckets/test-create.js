"use strict";
const { assert } = require('chai');
const { dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');


describe('users3buckets.create', () => {
  it('posts a users3bucket', () => {
    const bucket_id = 42;
    const user_id = 'github|123';

    const post_users3buckets = mock_api()
      .post(`/users3buckets/`, {
        user: user_id,
        s3bucket: bucket_id,
        access_level: "readonly",
        is_admin: false,
      })
      .reply(201);

    return dispatch(handlers.create, { body: { user_id, bucket_id } })
      .then(({ redirect_url }) => {
        assert(post_users3buckets.isDone());
        assert.equal(redirect_url, url_for('buckets.details', { id: bucket_id }));
      });
  });
});
