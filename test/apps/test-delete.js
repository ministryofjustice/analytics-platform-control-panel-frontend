const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/apps/handlers');


describe('apps/delete', () => {
  it('deletes the specified app', () => {
    const body = { redirect_to: '/' };
    const params = { id: 2 };
    const user = { id_token: 'dummy-token' };

    const delete_app = mock_api()
      .delete(`/api/cpanel/v1/apps/${params.id}/`)
      .reply(204);

    return dispatch(handlers.delete, { body, params, user })
      .then(({ redirect_url }) => {
        assert(delete_app.isDone());
        assert.equal(redirect_url, body.redirect_to);
      });
  });
});
