const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/apps/handlers');
const { App, Bucket, ModelSet, User } = require('../../app/models');

const app = require('../fixtures/app');
const buckets = require('../fixtures/buckets');
const users = require('../fixtures/users');
const customers = require('../fixtures/customers');
const ingresses = require('../fixtures/ingresses');


describe('apps/edit', () => {
  it('loads app, buckets and users and shows a form', () => {
    mock_api().get(`/api/cpanel/v1/apps/${app.id}/`).reply(200, app);
    mock_api().get(`/api/cpanel/v1/apps/${app.id}/customers/`).reply(200, customers);
    mock_api().get('/api/cpanel/v1/s3buckets/?page_size=0').reply(200, buckets);
    mock_api().get('/api/cpanel/v1/users/?page_size=0').reply(200, users);
    mock_api().get('/k8s/apis/extensions/v1beta1/namespaces/apps-prod/ingresses?labelSelector=repo%3Dtest-app').reply(200, ingresses);

    const expected = {
      app: new App(app),
      buckets: new ModelSet(Bucket, buckets.results),
      users: new ModelSet(User, users.results),
    };


    return dispatch(handlers.details, { params: { id: app.id } })
      .then(({ template, context }) => {
        assert.equal(template, 'apps/details.html');
        assert.deepEqual(context.app, expected.app);
        assert.deepEqual(context.buckets_options, expected.buckets);
        assert.deepEqual(context.users, expected.users);
        assert.equal(context.host, 'test-app.apps.dev.mojanalytics.xyz');
      });
  });
});
