const GithubAPI = require('@octokit/rest');
const { ManagementClient } = require('auth0');
const { parse: parseUrl } = require('url');
const { parse: parseQuery } = require('querystring');

class GithubAPIClient extends GithubAPI {
  constructor(conf) {
    super(conf.github);
    this.auth0_config = conf.auth0;

    // shadow the authenticate method
    const { authenticate } = this;
    this.authenticate = user => this.get_access_token(user)
      .then((token) => {
        authenticate({ type: 'token', token });
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

    async function getAllPages(method, params = {}) {
      const defaultParams = { per_page: 100 };
      const requestParams = { ...defaultParams, ...params };
      const firstPageResponse = await method(requestParams);
      let { data } = firstPageResponse;
      const lastPage = await this.hasLastPage(firstPageResponse);
      const requests = [];

      if (lastPage) {
        const lastPageNum = parseInt(parseQuery(parseUrl(lastPage).query).page, 10);

        // queue up a bunch of requests
        for (let i = 2; i <= lastPageNum; i += 1) {
          requests.push(method({ ...requestParams, page: i }));
        }
        // wait for them to finish and add to the data from the initial request
        const responses = await Promise.all(requests);
        const pagedData = responses.map(x => x.data);
        data = data.concat(...pagedData);
      }

      return data;
    }
    this.getAllPages = getAllPages;
  }
}

exports.GithubAPIClient = GithubAPIClient;
