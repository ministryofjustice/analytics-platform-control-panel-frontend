"use strict";

const assert = require('chai').assert;
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/users3buckets/handlers');
const url_for = require('../app/routes').url_for;


describe('Edit bucket form', () => {

  describe('when granting access to user', () => {

    it('make request to API', () => {
      const bucket_id = 42;
      const user_id = 'github|123';

      const post_users3buckets = nock(config.api.base_url)
        .post(`/users3buckets/`, {
          user: user_id,
          s3bucket: bucket_id,
          access_level: "readonly",
          is_admin: false,
        })
        .reply(201);

      let request = new Promise((resolve, reject) => {
        let req = {
          body: {
            user_id: user_id,
            bucket_id: bucket_id,
          },
        };
        let res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          }
        };

        handlers.create[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(post_users3buckets.isDone(), 'Did not make POST request to API endpoint /users3buckets/ as expected');

          const expected_redirect_url = url_for('buckets.details', {id: bucket_id});
          assert.equal(redirect_url, expected_redirect_url);
        });
    });

  });

});
