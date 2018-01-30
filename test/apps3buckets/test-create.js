const { assert } = require('chai');
const { dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/apps3buckets/handlers');

const app = require('../fixtures/app')


describe('apps3buckets/create', () => {
  it('creates an apps3bucket and redirects', () => {
    const bucket_id = 42;
    const app_id = 1;

    mock_api()
      .get(`/apps/${app_id}/`)
      .reply(200, app);

    const post_apps3buckets = mock_api()
      .post('/apps3buckets/', {
        app: app_id,
        s3bucket: bucket_id,
        access_level: 'readonly',
      })
      .reply(201);

    return dispatch(handlers.create, { body: { app_id, bucket_id } })
      .then(({ redirect_url }) => {
        assert(post_apps3buckets.isDone());
        assert.equal(redirect_url, url_for('apps.details', { id: app_id }));
      });
  });
});
