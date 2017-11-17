const { assert } = require('chai');
const nock = require('nock');

const config = require('../app/config');
const handlers = require('../app/apps/handlers');


describe('Delete app', () => {
  describe('when deleting an app', () => {
    it('makes a DELETE request to the API', () => {
      const app_id = 2;
      const redirect_to = '/apps';

      const delete_app = nock(config.api.base_url)
        .delete(`/apps/${app_id}/`)
        .reply(204);

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { id: app_id },
          body: { redirect_to },
        };
        const res = {
          redirect: (redirect_url) => {
            resolve(redirect_url);
          },
        };

        handlers.app_delete[1](req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(delete_app.isDone(), `Did't make DELETE request to API endpoint to /apps/${app_id}/`);
          assert.equal(redirect_url, redirect_to);
        });
    });
  });
});
