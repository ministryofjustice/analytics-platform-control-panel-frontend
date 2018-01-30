

const { assert } = require('chai');
const { config, dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users/handlers');
const { App, Bucket, ModelSet, User } = require('../../app/models');

const user = require('../fixtures/user');
const apps = require('../fixtures/apps');
const buckets = require('../fixtures/buckets');


describe('users', () => {
  describe('edit', () => {
    it('loads user, apps and buckets and shows a form', () => {
      mock_api().get(`/users/${escape(user.auth0_id)}/`).reply(200, user);
      mock_api().get('/apps/').reply(200, apps);
      mock_api().get('/s3buckets/').reply(200, buckets);

      const expected = {
        user: new User(user),
        apps: new ModelSet(App, apps.results).slice(1),
        buckets: new ModelSet(Bucket, buckets.results).slice(1),
      };

      return dispatch(handlers.user_edit, { params: { id: user.auth0_id } })
        .then(({ template, context }) => {
          assert.equal(template, 'users/edit.html');
          assert.deepEqual(context.user, expected.user);
          assert.deepEqual(context.apps_options, expected.apps);
          assert.deepEqual(context.buckets_options, expected.buckets);
        });
    });
  });
});
