const { assert } = require('chai');
const { GithubAPIClient } = require('../../app/api_clients/github');
const { config } = require('../conftest');
const nock = require('nock');
const { User } = require('../../app/models');

const auth0_user_response = require('../fixtures/auth0_user');
const repos_response = require('../fixtures/repos');


describe('Github API client', () => {
  const auth0_id = 'github|12345';

  config.auth0 = {
    domain: 'test.eu.auth0.com',
    clientID: 'dummy-client-id',
    clientSecret: 'dummy-client-secret',
  };
  config.github = {
    host: 'api.github.com',
  };
  const test_user = new User({ auth0_id });
  const api = new GithubAPIClient(config);

  it('requests an access token if not set', () => {
    nock(`https://${config.auth0.domain}`)
      .post('/oauth/token')
      .reply(200, {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 86400,
      });

    const get_auth0_user = nock(`https://${config.auth0.domain}`)
      .get(`/api/v2/users/${escape(auth0_id)}`)
      .reply(200, auth0_user_response);

    nock(`https://${config.github.host}`)
      .get('/user/repos')
      .reply(200, repos_response);

    return api.authenticate(test_user)
      .then(() => {
        assert(get_auth0_user.isDone());
        return api.repos.list({});
      })
      .then((repos) => {
        assert.deepEqual(repos.data, repos_response);
      });
  });

  it('pages through endpoints if pagination helper used', () => {
    const path = '/orgs/test-org/repos';
    const rawHeaders = {
      Link: `<https://${config.github.host}/${path}?page=2&other=1234>; rel="last"}`,
    };

    const page1 = nock(`https://${config.github.host}`)
      .get(path)
      .query({ type: 'all', per_page: 100 })
      .reply(200, [], rawHeaders);

    const page2 = nock(`https://${config.github.host}`)
      .get(path)
      .query({ type: 'all', per_page: 100, page: 2 })
      .reply(200, [], rawHeaders);

    return api.authenticate(test_user)
      .then(() => api.getAllPages(api.repos.listForOrg, { org: 'test-org', type: 'all' }).then((data) => {
        assert(page1.isDone());
        assert(page2.isDone());
        assert(Array.isArray(data));
        assert.isEmpty(data);
      }));
  });
});
