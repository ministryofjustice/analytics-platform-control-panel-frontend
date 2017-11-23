"use strict";

const { assert } = require('chai');
const { ModelSet } = require('../app/base-model');
const { App, Bucket, User } = require('../app/models');
const { config, mock_api } = require('./conftest');
const handlers = require('../app/buckets/handlers');


describe('Edit bucket form', () => {

  describe('when rendered', () => {

    it('loads bucket, apps and users from API', () => {

      const bucket = require('./fixtures/bucket');
      const apps = require('./fixtures/apps');
      const users = require('./fixtures/users');

      const get_bucket = mock_api()
        .get(`/s3buckets/${bucket.id}/`)
        .reply(200, bucket);
      const get_apps = mock_api()
        .get(`/apps/`)
        .reply(200, apps);
      const get_users = mock_api()
        .get(`/users/`)
        .reply(200, users);

      const request = new Promise((resolve, reject) => {
        const req = {params: {id: bucket.id}};
        const res = {
          render: (template, context) => {
            resolve({template: template, context: context});
          },
        };

        handlers.bucket_details[1](req, res, reject);
      });

      const expected = {
        'apps': new ModelSet(App, apps.results).slice(1),
        'users': new ModelSet(User, users.results).slice(1),
        'bucket': new Bucket(bucket),
      };

      return request
        .then((args) => {

          assert(get_bucket.isDone(), `Didn't GET /s3buckets/${bucket.id}/`);
          assert(get_apps.isDone(), "Didn't GET /apps/");
          assert(get_users.isDone(), "Didn't GET /users/");

          assert.equal(args.template, 'buckets/details.html');

          assert.deepEqual(args.context.bucket, expected.bucket);
          assert.deepEqual(args.context.apps_options, expected.apps);
          assert.deepEqual(args.context.users_options, expected.users);
        });
    });

  });

});
