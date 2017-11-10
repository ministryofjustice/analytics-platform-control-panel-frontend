"use strict";

const assert = require('chai').assert;
const nock = require('nock');

const config = require('../app/config');
const views = require('../app/buckets/views');


describe('Edit bucket form', () => {

  describe('when rendered', () => {

    it('loads bucket, apps and users from API', () => {
      const bucket = require('./fixtures/bucket');
      const apps = require('./fixtures/apps');
      const users = require('./fixtures/users');

      // Mock API requests
      const bucket_details_request = nock(config.api.base_url)
        .get(`/s3buckets/${bucket.id}/`)
        .reply(200, bucket);
      const apps_list_request = nock(config.api.base_url)
        .get(`/apps/`)
        .reply(200, apps);
      const users_list_request = nock(config.api.base_url)
        .get(`/users/`)
        .reply(200, users);

      const request = new Promise((resolve, reject) => {
        const req = {params: {id: bucket.id}};
        const res = {
          render: (template, context) => {
            resolve({template: template, context: context});
          },
        };

        views.bucket_edit[1](req, res, reject);
      });

      return request
        .then((args) => {
          assert(bucket_details_request.isDone(), `API call to /s3buckets/${bucket.id}/ expected`);
          assert(apps_list_request.isDone(), 'API call to /apps/ expected');
          assert(users_list_request.isDone(), 'API call to /users/ expected');
          assert.equal(args.template, 'buckets/edit.html');
          assert.deepEqual(args.context.bucket, bucket);
          assert.deepEqual(args.context.apps_options, [apps.results[1]]);
          assert.deepEqual(args.context.users_options, [users.results[1]]);
        });
    });

  });

});
