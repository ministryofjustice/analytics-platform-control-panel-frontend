"use strict";

const assert = require('chai').assert;
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/apps/handlers');


describe('Edit app form', () => {

  describe('when rendered', () => {

    it('loads app, buckets and users from API', () => {
      const app = require('./fixtures/app');
      const buckets = require('./fixtures/buckets');
      const users = require('./fixtures/users');

      // Mock API requests
      let app_details_request = nock(config.api.base_url)
        .get(`/apps/${app.id}/`)
        .reply(200, app);
      let buckets_list_request = nock(config.api.base_url)
        .get(`/s3buckets/`)
        .reply(200, buckets);
      let users_list_request = nock(config.api.base_url)
        .get(`/users/`)
        .reply(200, users);

      let request = new Promise((resolve, reject) => {
        let req = {params: {id: app.id}};
        let res = {
          render: (template, context) => {
            resolve({'template': template, 'context': context});
          }
        };

        handlers.app_details[1](req, res, reject);
      });

      return request
        .then((args) => {
          assert(app_details_request.isDone(), `API call to /apps/${app.id}/ expected`);
          assert(buckets_list_request.isDone(), 'API call to /s3buckets/ expected');
          assert(users_list_request.isDone(), 'API call to /users/ expected');
          assert.equal(args.template, 'apps/details.html');
          assert.deepEqual(args.context.app, app);
          assert.deepEqual(args.context.buckets_options, buckets.results);
          assert.deepEqual(args.context.users, users.results);
        });
    });

  });

});
