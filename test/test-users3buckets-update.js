const { assert } = require('chai');
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/users3buckets/handlers');


describe('Edit bucket form', () => {
  describe('when updating user access', () => {
    it('make request to API', () => {
      const users3bucket_id = 42;
      const access_level = 'readonly';
      const redirect_to = 'buckets/123';

      const patch_users3buckets = nock(config.api.base_url)
        .patch(`/users3buckets/${users3bucket_id}/`, {
          id: users3bucket_id,
          access_level: access_level,
        })
        .reply(201);

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { id: users3bucket_id },
          body: { access_level, redirect_to },
        };
        const res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          },
        };

        handlers.update[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(patch_users3buckets.isDone(), `Didn't make PATCH request to API endpoint /users3buckets/${users3bucket_id}/ as expected`);

          assert.equal(redirect_url, redirect_to);
        });
    });
  });
});
