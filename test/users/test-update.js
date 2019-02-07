const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users/handlers');

const user = require('../fixtures/user');


describe('users.update', () => {
  it('sets the superuser flag', () => {
    const expected = {
      url: `/users/${encodeURIComponent(user.auth0_id)}`,
      body: Object.assign(user, { is_superuser: true }),
    };
    mock_api().get(expected.url).reply(200, user);
    const request = mock_api().patch(expected.url, expected.body).reply(200);

    return dispatch(
      handlers.update,
      {
        params: { id: user.auth0_id },
        body: { superadmin: 'true' },
      },
    )
      .then(({ redirect_url }) => {
        assert.equal(expected.url, redirect_url);
        assert(request.isDone());
      });
  });
});
