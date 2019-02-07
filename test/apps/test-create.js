const { assert } = require('chai');
const { config, dispatch, mock_api, url_for, user } = require('../conftest');
const nock = require('nock');
const handlers = require('../../app/apps/handlers');


describe('apps/create', () => {
  it('creates a new app and redirects to the new app details', () => {
    const form_data = {
      repo_typeahead: 'test-app',
      repo_url: 'http://example.com',
    };
    const created_app = { id: 1 };

    mock_api()
      .post('/apps')
      .reply(201, created_app);

    mock_api()
      .post('/userapps')
      .reply(201, {
        app: created_app.id,
        user: 'test-user',
        access_level: 'readwrite',
        is_admin: true,
      });

    return dispatch(handlers.create, { body: form_data })
      .then(({ redirect_url }) => {
        assert.equal(redirect_url, url_for('apps.details', { id: created_app.id }));
      });
  });

  it('shows an error if an app exists for the specified repo', () => {
    const form_data = {
      repo_typeahead: 'test-app',
      repo_url: 'http://example.com',
    };

    const errors = {
      repo_url: 'app with this repo url already exists',
    };

    user.github_access_token = 'test-github-token';

    mock_api()
      .post('/apps')
      .reply(400, errors);

    config.github.orgs = [
      'test-org-1',
      'test-org-2',
    ];
    config.github.orgs.forEach((org) => {
      nock(`https://${config.github.host}`)
        .get(`/orgs/${org}/repos`)
        .query({ type: 'all', per_page: 100 })
        .reply(200, []);
    });

    mock_api()
      .get('/s3buckets?page_size=0')
      .reply(200, []);

    return dispatch(handlers.create, { body: form_data })
      .then(({ redirect_url, template, context }) => {
        assert.isUndefined(redirect_url);
        assert.equal(template, 'apps/new.html');
        assert.deepEqual(context.errors, errors);
      });
  });
});
