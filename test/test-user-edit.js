"use strict";

const assert = require('chai').assert;
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/users/handlers');


describe('Edit user form', () => {

  describe('when rendered', () => {

    it('loads user, apps and buckets from API', () => {
      const user = require('./fixtures/user');
      const apps = require('./fixtures/apps');
      const buckets = require('./fixtures/buckets');

      // Mock API requests
      const user_details_request = nock(config.api.base_url)
        .get(`/users/${user.id}/`)
        .reply(200, user);
      const apps_list_request = nock(config.api.base_url)
        .get(`/apps/`)
        .reply(200, apps);
      const buckets_list_request = nock(config.api.base_url)
        .get(`/s3buckets/`)
        .reply(200, buckets);

      const request = new Promise((resolve, reject) => {
        const req = {params: {id: user.id}};
        const res = {
          render: (template, context) => {
            resolve({template: template, context: context});
          },
        };

        handlers.user_edit[1](req, res, reject);
      });

      return request
        .then((args) => {
          assert(user_details_request.isDone(), `API call to /users/${user.id}/ expected`);
          assert(apps_list_request.isDone(), 'API call to /apps/ expected');
          assert(buckets_list_request.isDone(), 'API call to /s3buckets/ expected');
          assert.equal(args.template, 'users/edit.html');
          assert.deepEqual(args.context.user, user);
          assert.deepEqual(args.context.apps_options, [apps.results[1]]);
          assert.deepEqual(args.context.buckets_options, [buckets.results[1]]);
        });
    });

  });

});
