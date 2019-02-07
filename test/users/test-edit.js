const { assert } = require('chai');
const { dispatch, mock_api } = require('../conftest');
const handlers = require('../../app/users/handlers');
const { User } = require('../../app/models');

const user = require('../fixtures/user');


describe('users.details', () => {
  it('loads the user and shows a form', () => {
    mock_api().get(`/users/${encodeURIComponent(user.auth0_id)}`).reply(200, user);

    const expected = {
      user: new User(user),
    };

    return dispatch(handlers.details, { params: { id: user.auth0_id } })
      .then(({ template, context }) => {
        assert.equal(template, 'users/details.html');
        assert.deepEqual(context.user, expected.user);
      });
  });
});
