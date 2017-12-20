const { assert } = require('chai');
const { GithubAPIClient } = require('../../app/api_clients/github');
const { config } = require('../conftest');
const nock = require('nock');
const { User } = require('../../app/models');


describe('Github API client', () => {

  it('requests an access token if not set', () => {
    const auth0_id = 'github|12345';
    const auth0_user_response = require('../fixtures/auth0_user');
    const repos_response = require('../fixtures/repos');

    config.auth0 = {
      domain: 'test.eu.auth0.com',
      clientID: 'dummy-client-id',
      clientSecret: 'dummy-client-secret',
    };
    config.github = {
      host: 'api.github.com',
    };

    const api = new GithubAPIClient(config);

    const client_credentials_grant = nock(`https://${config.auth0.domain}`)
      .post(`/oauth/token`)
      .reply(200, {
        'access_token': 'test-access-token',
        'token_type': 'Bearer',
        'expires_in': 86400
      });

    const get_auth0_user = nock(`https://${config.auth0.domain}`)
      .get(`/api/v2/users/${escape(auth0_id)}`)
      .reply(200, auth0_user_response);

    const get_repos = nock(`https://${config.github.host}`)
      .get('/user/repos')
      .reply(200, repos_response);

    const test_user = new User({ auth0_id });

    return api.authenticate(test_user)
      .then(() => {
        assert(get_auth0_user.isDone());
        return api.repos.getAll({});
      })
      .then((repos) => {
        assert.deepEqual(repos.data, repos_response);
      });
  });
});
