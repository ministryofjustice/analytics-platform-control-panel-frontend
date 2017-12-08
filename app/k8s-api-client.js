const config = require('./config');
const { APIClient, JWTAuth } = require('./api-client');
const url = require('url');


function get_namespace(username) {
  // kubernetes namespaces must be valid DNS names
  let s = `user-${username.toLowerCase()}`;
  // may contain only alphanumeric characters and hyphens
  s = s.replace(/[^a-z0-9]+/, '-');
  // must start with an alphanumeric character
  s = s.replace(/^[^a-z0-9]*/, '');
  // must be at most 63 characters
  s = s.slice(0, 63);
  // must end with an alphanumeric character
  s = s.replace(/[^a-z0-9]*$/, '');
  return s;
}

exports.get_namespace = get_namespace;


class KubernetesAPIClient extends APIClient {
  endpoint_url(endpoint, namespace = undefined) {
    let ns = namespace || this.namespace || 'default';

    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    const api = {
      'deployments': 'apis/apps/v1beta2',
      'pods': 'api/v1',
    }[endpoint.split('/')[0]];

    return url.resolve(this.base_url, `k8s/${api}/namespaces/${ns}/${endpoint}`);
  }
}


exports.KubernetesAPIClient = KubernetesAPIClient;

const api = new KubernetesAPIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;
