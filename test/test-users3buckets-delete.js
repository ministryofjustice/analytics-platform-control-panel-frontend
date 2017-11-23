const { assert } = require('chai');
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/users3buckets/handlers');


describe('Edit bucket form', () => {
  describe('when revoking access to user', () => {
    it('make request to API', () => {
      const users3bucket_id = 42;
      const redirect_to = 'users/github|123';

      const delete_users3buckets = nock(config.api.base_url)
        .delete(`/users3buckets/${users3bucket_id}/`)
        .reply(204);

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { id: users3bucket_id },
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
          assert(delete_users3buckets.isDone(), `Did't make DELETE request to API endpoint to /users3buckets/${users3bucket_id}/`);
          assert.equal(redirect_url, redirect_to);
        });
    });
  });
});