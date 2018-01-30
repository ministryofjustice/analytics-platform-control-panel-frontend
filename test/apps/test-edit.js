const { assert } = require('chai');
const { dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/apps/handlers');
const { App, Bucket, ModelSet, User } = require('../../app/models');

const app = require('../fixtures/app');
const buckets = require('../fixtures/buckets');
const users = require('../fixtures/users');


describe('apps/edit', () => {
  it('loads app, buckets and users and shows a form', () => {
    mock_api().get(`/apps/${app.id}/`).reply(200, app);
    mock_api().get(`/s3buckets/`).reply(200, buckets);
    mock_api().get(`/users/`).reply(200, users);

    const expected = {
      'app': new App(app),
      'buckets': new ModelSet(Bucket, buckets.results),
      'users': new ModelSet(User, users.results),
    }

    return dispatch(handlers.details, { params: { id: app.id } })
      .then(({ template, context }) => {
        assert.equal(template, 'apps/details.html');
        assert.deepEqual(context.app, expected.app);
        assert.deepEqual(context.buckets_options, expected.buckets);
        assert.deepEqual(context.users, expected.users);
      });
  });
});
