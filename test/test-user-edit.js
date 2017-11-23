"use strict";

const { assert } = require('chai');
const { ModelSet } = require('../app/base-model');
const { App, Bucket, User } = require('../app/models');
const { config, mock_api } = require('./conftest');
const handlers = require('../app/users/handlers');


describe('Edit user form', () => {

  describe('when rendered', () => {

    it('loads user, apps and buckets from API', () => {
      const user = require('./fixtures/user');
      const apps = require('./fixtures/apps');
      const buckets = require('./fixtures/buckets');

      const get_user = mock_api().get(`/users/${user.id}/`).reply(200, user);
      const get_apps = mock_api().get(`/apps/`).reply(200, apps);
      const get_buckets = mock_api().get(`/s3buckets/`).reply(200, buckets);

      const request = new Promise((resolve, reject) => {
        const req = {params: {id: user.id}};
        const res = {
          render: (template, context) => {
            resolve({template: template, context: context});
          },
        };

        handlers.user_edit(req, res, reject);
      });

      const expected = {
        'user': new User(user),
        'apps': new ModelSet(App, apps.results).slice(1),
        'buckets': new ModelSet(Bucket, buckets.results).slice(1),
      };

      return request
        .then((args) => {
          assert(get_user.isDone(), `Didn't GET /users/${user.id}/`);
          assert(get_apps.isDone(), "Didn't GET /apps/");
          assert(get_buckets.isDone(), "Didn't GET /s3buckets/");

          assert.equal(args.template, 'users/edit.html');

          assert.deepEqual(args.context.user, expected.user);
          assert.deepEqual(args.context.apps_options, expected.apps);
          assert.deepEqual(args.context.buckets_options, expected.buckets);
        });
    });

  });

});
