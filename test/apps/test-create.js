const { assert } = require('chai');
const { dispatch, mock_api, url_for } = require('../conftest');
const handlers = require('../../app/apps/handlers');


describe('apps/create', () => {
  it('creates a new app and redirects to the new app details', () => {
    const form_data = {
      repo_typeahead: 'test-app',
      description: 'test app description',
      repo_url: 'http://example.com',
    };
    const created_app = { id: 1 };
    const user = { auth0_id: 'test-user', id_token: 'dummy-token' };

    mock_api()
      .post('/apps/')
      .reply(201, created_app);

    mock_api()
      .post('/userapps/')
      .reply(201, {
        app: created_app.id,
        user: 'test-user',
        access_level: 'readwrite',
        is_admin: true,
      })

    return dispatch(handlers.create, { body: form_data, user })
      .then(({ redirect_url }) => {
        assert.equal(redirect_url, url_for('apps.details', { id: created_app.id }));
      });
  });
});
