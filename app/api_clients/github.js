const GithubAPI = require('@octokit/rest');
const { ManagementClient } = require('auth0');


class GithubAPIClient extends GithubAPI {
  constructor(conf) {
    super(conf.github);
    this.auth0_config = conf.auth0;

    this.authenticate = user => this.get_access_token(user)
      .then((token) => {
        this.authenticate({ type: 'token', token });
      });

    this.get_access_token = (user) => {
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
    };
  }
}

exports.GithubAPIClient = GithubAPIClient;
