const { assert } = require('chai');
const { dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/users3buckets/handlers');

const user = require('../fixtures/user');


describe('users3buckets.create', () => {
  it('posts a users3bucket', () => {
    const bucket_id = 42;
    const user_id = user.auth0_id;
    const data_access_level = 'readonly';

    const post_users3buckets = mock_api()
      .post('/users3buckets/', {
        user: user_id,
        s3bucket: bucket_id,
        access_level: data_access_level,
        is_admin: false,
      })
      .reply(201);

    const get_user = mock_api()
      .get(`/users/${escape(user_id)}/`)
      .reply(200, user);

    const req = {
      body: { user_id, bucket_id, data_access_level },
      user,
      session: {
        passport: {
          user: {}
        }
      },
    };

    return dispatch(handlers.create, req)
      .then(({ redirect_url }) => {
        assert(get_user.isDone());
        assert(post_users3buckets.isDone());
        assert.equal(redirect_url, url_for('buckets.details', { id: bucket_id }));
      });
  });
});
