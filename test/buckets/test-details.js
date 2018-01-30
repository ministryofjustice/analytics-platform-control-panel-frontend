const { assert } = require('chai');
const { config, dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/buckets/handlers');
const { App, Bucket, ModelSet, User } = require('../../app/models');

const bucket = require('../fixtures/bucket');
const apps = require('../fixtures/apps');
const users = require('../fixtures/users');


describe('buckets/details', () => {
  it('loads bucket, apps and user and shows a form', () => {
    const params = { id: bucket.id };
    const user = { auth0_id: 'github|12345', id_token: 'dummy-token' };

    mock_api().get(`/s3buckets/${bucket.id}/`).reply(200, bucket);
    mock_api().get('/apps/').reply(200, apps);
    mock_api().get('/users/').reply(200, users);

    const expected = {
      'apps': new ModelSet(App, apps.results).slice(1),
      'users': new ModelSet(User, users.results).slice(1),
      'bucket': new Bucket(bucket),
    };

    return dispatch(handlers.bucket_details, { params, user })
      .then(({ template, context }) => {
        assert.equal(template, 'buckets/details.html');

        assert.deepEqual(context.bucket, expected.bucket);
        assert.deepEqual(context.apps_options, expected.apps);
        assert.deepEqual(context.users_options, expected.users);
      });
  });
});
