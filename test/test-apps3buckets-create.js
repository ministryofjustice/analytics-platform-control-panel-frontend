const { assert } = require('chai');

const { config, mock_api, url_for } = require('./conftest');
const handlers = require('../app/apps3buckets/handlers');


describe('Edit bucket form', () => {

  describe('when granting access to user', () => {

    it('make request to API', () => {

      const bucket_id = 42;
      const app_id = 1;

      const get_app = mock_api()
        .get(`/apps/${app_id}/`)
        .reply(200, require('./fixtures/app'));

      const post_apps3buckets = mock_api()
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
          assert(get_app.isDone(), `Did not GET /apps/${app_id}`);
          assert(post_apps3buckets.isDone(), 'Did not POST to /apps3buckets/');

          const expected_redirect_url = url_for('apps.details', { id: app_id });
          assert.equal(redirect_url, expected_redirect_url);
        });
    });
  });
});
