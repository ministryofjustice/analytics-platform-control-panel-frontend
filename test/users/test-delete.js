const { assert } = require('chai');
const { dispatch, mock_api, url_for, user } = require('../conftest');
const handlers = require('../../app/users/handlers');


describe('users', () => {
  describe('delete', () => {
    it('deletes user and redirects to list', () => {
      const delete_request = mock_api().delete(`/users/${escape(user.auth0_id)}/`).reply(204);

      return dispatch(handlers.delete, { params: { id: user.auth0_id } })
        .then(({ redirect_url }) => {
          assert.equal(redirect_url, url_for('users.list'));
          assert(delete_request.isDone());
        });
    });
  });
});
