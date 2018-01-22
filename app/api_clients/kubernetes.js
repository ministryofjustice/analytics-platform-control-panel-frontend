const config = require('../config');
const { ControlPanelAPIClient } = require('./control_panel_api');
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


class KubernetesAPIClient extends ControlPanelAPIClient {
  authenticate(user) {
    super.authenticate(user);
    this.user = user;
    this.namespace = user.kubernetes_namespace;
  }

  endpoint_url(endpoint, namespace = undefined) {
    const ns = namespace || this.namespace || 'default';

    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    const api = {
      deployments: 'apis/apps/v1beta2',
      pods: 'api/v1',
    }[endpoint.split('/')[0]];

    return url.resolve(this.conf.base_url, `k8s/${api}/namespaces/${ns}/${endpoint}`);
  }

  in_namespace(namespace) {
    return new Proxy(this, {
      get: (target, property) => {
        if (property === 'endpoint_url') {
          return new Proxy(target[property], {
            apply: (obj, thisArg, args) => obj.apply(thisArg, [args[0], namespace]),
          });
        }
        return target[property];
      },
    });
  }
}


exports.KubernetesAPIClient = KubernetesAPIClient;
