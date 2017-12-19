const config = require('../config');
const GithubAPI = require('github');
const { ManagementClient } = require('auth0');


class GithubAPIClient extends GithubAPI {
  constructor(config) {
    super(config.github);
    this.auth0_config = config.auth0;
  }

  authenticate(user) {
    return this.get_access_token(user)
      .then((token) => {
        super.authenticate({ type: 'token', token });
      });
  }

  get_access_token(user) {
    if (!user.github_access_token) {
      const management = new ManagementClient({
        domain: this.auth0_config.domain,
        clientId: this.auth0_config.clientID,
        clientSecret: this.auth0_config.clientSecret,
      });

      return management.getUser({ id: user.auth0_id })
        .then((profile) => {
          user.github_access_token = profile.identities[0].access_token;
          return user.github_access_token;
        });
    }

    return Promise.resolve(user.github_access_token);
  }
}

exports.GithubAPIClient = GithubAPIClient;

const api = new GithubAPIClient(config);

exports.api = api;
