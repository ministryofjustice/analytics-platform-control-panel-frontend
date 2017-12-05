const config = require('./config');
const { APIClient, JWTAuth } = require('./api-client');
const url = require('url');


class KubernetesAPIClient extends APIClient {
  endpoint_url(endpoint, namespace = undefined) {
    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    let ns = namespace;
    if (!namespace) {
      ns = this.namespace;

      if (!ns) {
        ns = 'default';
      }
    }

    const api = {
      'deployments': 'apis/apps/v1beta2',
      'pods': 'api/v1',
    }[endpoint];

    return url.resolve(this.base_url, `k8s/${api}/namespaces/${ns}/${endpoint}`);
  }
}


exports.KubernetesAPIClient = KubernetesAPIClient;

const api = new KubernetesAPIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;
