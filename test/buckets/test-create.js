const { assert } = require('chai');
const { config, dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/buckets/handlers');


describe('buckets/create', () => {
  it('created a new bucket and redirects', () => {
    const bucket_name = 'dev-test-bucket';
    const body = {
      'new-datasource-name': bucket_name,
    };
    const user = { auth0_id: 'github|12345', id_token: 'dummy-token' };
    const created_bucket = {
      id: 1,
      url: config.api.base_url + '/s3buckets/1/',
      name: bucket_name,
      arn: `arn:aws:s3:::${bucket_name}`,
      apps3buckets: [],
      created_by: user.auth0_id,
    };

    mock_api()
      .post('/s3buckets/')
      .reply(201, created_bucket);

    return dispatch(handlers.create_bucket, { body, user })
      .then(({ redirect_url }) => {
        assert.equal(redirect_url, url_for('buckets.details', { id: created_bucket.id }));
      });
  });
});
