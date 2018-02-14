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
      url: `${config.api.base_url}/s3buckets/1/`,
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

  afterEach(() => {
    delete process.env.ENV;
  });

  it('show an error if a bucket already exists with specified name', () => {
    const form_data = {
      'new-datasource-name': 'test-bucket',
    };

    const errors = {
      name: 's3 bucket with this name already exists.',
    };

    process.env.ENV = 'test';

    mock_api()
      .post('/s3buckets/')
      .reply(400, errors);

    return dispatch(handlers.create_bucket, { body: form_data })
      .then(({ redirect_url, template, context }) => {
        assert.isUndefined(redirect_url);
        assert.equal(template, 'buckets/new.html');
        assert.deepEqual(context.error.error, errors);
        assert.equal(context.bucket_prefix, 'test-');
        assert.equal(context.bucket.name, 'test-bucket');
      });
  });
});
