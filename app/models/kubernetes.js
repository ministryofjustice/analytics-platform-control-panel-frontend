const { api } = require('../api_clients/control_panel_api');
const { cluster } = require('../config');
const kubernetes = require('../api_clients/kubernetes');
const base = require('./base');
const { DoesNotExist } = require('./control_panel_api');


class Model extends base.Model {
  static get pk() {
    return 'name';
  }

  static list(params = {}) {
    return kubernetes.api.get(this.endpoint, params)
      .then(result => new base.ModelSet(this.prototype.constructor, result.items));
  }

  static get(name) {
    return kubernetes.api.get(`${this.endpoint}/${name}`)
      .then(data => new this.prototype.constructor(data))
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, name);
        }
        throw error;
      });
  }

  static delete_all(params = {}) {
    return kubernetes.api.delete(this.endpoint, params);
  }
}

exports.Model = Model;


class Deployment extends Model {
  constructor(data) {
    super(data);
    this.pods = new base.ModelSet(Pod, []);
  }

  static get endpoint() {
    return 'deployments';
  }

  static list() {
    return Promise.all([super.list(), Pod.list()])
      .then(([deployments, pods]) => {
        const pod_groups = {};

        pods.forEach((pod) => {
          const app_label = pod.metadata.labels.app;

          if (!pod_groups[app_label]) {
            pod_groups[app_label] = [];
          }

          pod_groups[app_label].push(pod);
        });

        return deployments.map((deployment) => {
          deployment.pods = new base.ModelSet(Pod, pod_groups[deployment.metadata.labels.app]);
          return deployment;
        });
      });
  }

  static create(data) {
    return api.post(`tools/${data.tool_name}/deployments`, {});
  }

  restart() {
    return Pod.delete_all({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  get available() {
    return this.data.pods.some(pod => pod.status.phase === 'Running');
  }

  get app_label() {
    return this.data.metadata.labels.app;
  }

  get username() {
    // might get a truncated username
    return this.data.metadata.namespace.split('user-').join('');
  }

  get url() {
    return `https://${this.username}-${this.app_label}.${cluster.tools_domain}`;
  }
}

exports.Deployment = Deployment;


class Pod extends Model {
  static get endpoint() {
    return 'pods';
  }

  get status() {
    const containerStatus = this.data.status.containerStatuses;

    if (containerStatus) {
      const { state } = containerStatus[0];

      if (state.waiting) {
        return { phase: 'waiting', reason: state.waiting.reason };
      }

      if (state.terminated) {
        let { reason } = state.terminated;

        if (!reason) {
          if (state.terminated.signal) {
            reason = `Signal:${state.terminated.signal}`;
          } else {
            reason = `ExitCode:${state.terminated.exitCode}`;
          }
        }

        return { phase: 'terminated', reason };
      }
    }

    return { phase: this.data.status.phase };
  }

  get display_status() {
    const status = this.status;
    const reason = status.reason ? `: ${status.reason}` : '';
    return `${status.phase}${reason}`;
  }
}

exports.Pod = Pod;
