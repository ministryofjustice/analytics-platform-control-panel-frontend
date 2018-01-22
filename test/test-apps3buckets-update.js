const { assert } = require('chai');
const { config, mock_api, withAPI } = require('./conftest');
const handlers = require('../app/apps3buckets/handlers');


describe('Edit bucket form', () => {
  describe('when updating user access', () => {
    it('make request to API', withAPI(() => {
      const apps3bucket_id = 42;
      const access_level = 'readonly';
      const redirect_to = 'apps/123';

      const patch_apps3buckets = mock_api()
        .patch(`/apps3buckets/${apps3bucket_id}/`, {
          id: apps3bucket_id,
          access_level: access_level,
        })
        .reply(201);

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { id: apps3bucket_id },
          body: { access_level, redirect_to },
        };
        const res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          },
        };

        handlers.update(req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(patch_apps3buckets.isDone(), `Didn't PATCH /apps3buckets/${apps3bucket_id}/`);

          assert.equal(redirect_url, redirect_to);
        });
    }));
  });
});
