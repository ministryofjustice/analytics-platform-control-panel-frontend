const config = require('../config');
const GithubAPI = require('github');
const { ManagementClient } = require('auth0');


function get_access_token(user) {
  if (!user.github_access_token) {
    const management = new ManagementClient({
      domain: config.auth0.domain,
      clientId: config.auth0.clientId,
      clientSecret: config.auth0.clientSecret,
    });

    return management.getUser({ id: user.auth0_id })
      .then((profile) => {
        user.github_access_token = profile.identities[0].access_token;
        return user.github_access_token;
      });
  }

  return Promise.resolve(user.github_access_token);
}

exports.get_access_token = get_access_token;

const api = new GithubAPI(config.github);

exports.api = api;
