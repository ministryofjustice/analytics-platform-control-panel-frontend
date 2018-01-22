const { App, Bucket, ModelSet, User } = require('../app/models');
const { assert } = require('chai');
const { config, mock_api, url_for, withAPI } = require('./conftest');
const handlers = require('../app/apps/handlers');


describe('Edit app form', () => {
  describe('when rendered', () => {
    it('loads app, buckets and users from API', withAPI(() => {
      const app = require('./fixtures/app');
      const buckets = require('./fixtures/buckets');
      const user = require('./fixtures/user');
      const users = require('./fixtures/users');

      let app_details_request = mock_api()
        .get(`/apps/${app.id}/`)
        .reply(200, app);
      let buckets_list_request = mock_api()
        .get(`/s3buckets/`)
        .reply(200, buckets);
      let users_list_request = mock_api()
        .get(`/users/`)
        .reply(200, users);

      let request = new Promise((resolve, reject) => {
        let req = {
          params: {id: app.id},
          user: {user_id: user.auth0_id}
        };
        let res = {
          render: (template, context) => {
            resolve({'template': template, 'context': context});
          }
        };

        handlers.details(req, res, reject);
      });

      const expected = {
        'app': new App(app),
        'buckets': new ModelSet(Bucket, buckets.results),
        'users': new ModelSet(User, users.results),
      }

      return request
        .then((args) => {
          assert(app_details_request.isDone(), `API call to /apps/${app.id}/ expected`);
          assert(buckets_list_request.isDone(), 'API call to /s3buckets/ expected');
          assert(users_list_request.isDone(), 'API call to /users/ expected');
          assert.equal(args.template, 'apps/details.html');
          assert.deepEqual(args.context.app, expected.app);
          assert.deepEqual(args.context.buckets_options, expected.buckets);
          assert.deepEqual(args.context.users, expected.users);
        });
    }));
  });
});
