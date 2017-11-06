"use strict";

const assert = require('chai').assert;
const nock = require('nock');

const config = require('../app/config');
const views = require('../app/apps/views');


describe('Edit app form', () => {

  describe('when rendered', () => {

    it('loads app, buckets and users from API', () => {
      const app = require('./fixtures/app')
      const buckets = require('./fixtures/buckets')
      const users = require('./fixtures/users')

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

      let req = {'params': {'id': 1}};
      let res = {};
      let request = new Promise((resolve, reject) => {

        res.render = function (template, context) {
          resolve({'template': template, 'context': context});
        }

        views.app_edit[1](req, res, reject);
      });

      return request
        .then((render) => {
          assert(app_details_request.isDone(), `API call to /apps/${app.id}/ expected`);
          assert(buckets_list_request.isDone(), 'API call to /s3buckets/ expected');
          assert(users_list_request.isDone(), 'API call to /users/ expected');
          assert.deepEqual(render.context.app, app);
          assert.deepEqual(render.context.buckets, buckets.results);
          assert.deepEqual(render.context.users, users.results);
        });
    });

  });

});
