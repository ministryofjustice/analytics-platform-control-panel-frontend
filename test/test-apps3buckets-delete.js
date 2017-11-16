const { assert } = require('chai');
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/apps3buckets/handlers');


describe('Edit bucket form', () => {
  describe('when revoking access to user', () => {
    it('make request to API', () => {
      const apps3bucket_id = 42;
      const redirect_to = 'apps/123';

      // Mock `DELETE /apps3buckets/:id` request
      const delete_apps3buckets = nock(config.api.base_url)
        .delete(`/apps3buckets/${apps3bucket_id}/`)
        .reply(204);

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { id: apps3bucket_id },
          body: { redirect_to },
        };
        const res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          },
        };

        handlers.delete[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(delete_apps3buckets.isDone(), `Make DELETE request to /apps3buckets/${apps3bucket_id} (API)`);
          assert.equal(redirect_url, redirect_to);
        });
    });
  });
});
