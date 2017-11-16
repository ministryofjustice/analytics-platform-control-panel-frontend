const { assert } = require('chai');
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/apps3buckets/handlers');
const { url_for } = require('../app/routes');


describe('Edit bucket form', () => {
  describe('when granting access to user', () => {
    it('make request to API', () => {
      const bucket_id = 42;
      const app_id = 123;

      // Mock `POST /apps3buckets` request
      const post_apps3buckets = nock(config.api.base_url)
        .post('/apps3buckets/', {
          app: app_id,
          s3bucket: bucket_id,
          access_level: 'readonly',
        })
        .reply(201);

      const request = new Promise((resolve, reject) => {
        const req = {
          body: { app_id, bucket_id },
        };
        const res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          },
        };

        handlers.create[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(post_apps3buckets.isDone(), 'Make POST request to /apps3buckets (API)');

          const expected_redirect_url = url_for('apps.details', { id: app_id });
          assert.equal(redirect_url, expected_redirect_url);
        });
    });
  });
});
