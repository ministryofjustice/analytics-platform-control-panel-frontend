const base = require('./base');
const config = require('../config');
const { DoesNotExist } = require('./control_panel_api');
const cls = require('cls-hooked');

const IDLED_LABEL = 'mojanalytics.xyz/idled';


class Model extends base.Model {
  static get kubernetes() {
    const ns = cls.getNamespace(config.continuation_locals.namespace);
    return ns.get('kubernetes');
  }

  get kubernetes() {
    return this.constructor.kubernetes;
  }

  static get cpanel() {
    const ns = cls.getNamespace(config.continuation_locals.namespace);
    return ns.get('cpanel');
  }

  get cpanel() {
    return this.constructor.cpanel;
  }

  static get pk() {
    return 'name';
  }

  static list(params = {}) {
    return this.kubernetes.get(this.endpoint, params)
      .then(result => new base.ModelSet(this.prototype.constructor, result.items));
  }

  static get(name) {
    return this.kubernetes.get(`${this.endpoint}/${name}`)
      .then(data => new this.prototype.constructor(data))
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, name);
        }
        throw error;
      });
  }

  static delete_all(params = {}) {
    return this.kubernetes.delete(this.endpoint, params);
  }
}

exports.Model = Model;


function group_by(items, key) {
  return items.reduce((groups, item) => {
    const name = key(item);

    if (!groups[name]) {
      groups[name] = [];
    }

    groups[name].push(item);

    return groups;
  }, {});
}


class Deployment extends Model {
  constructor(data) {
    super(data);
    this.pods = new base.ModelSet(Pod, []);
  }

  static get endpoint() {
    return 'deployments';
  }

  get_pods() {
    if (!this.pods.length) {
      return Pod.list({ labelSelector: `app=${this.app_label}` })
        .then((pods) => {
          this._pods = pods; // eslint-disable-line no-underscore-dangle
          return pods;
        });
    }
    return Promise.resolve(this.pods);
  }

  static list() {
    return Promise.all([super.list(), Pod.list()])
      .then(([deployments, pods]) => {
        const app_label = x => x.metadata.labels.app;
        const pod_groups = group_by(pods, app_label);

        return deployments.map((deployment) => {
          deployment.pods = new base.ModelSet(Pod, pod_groups[app_label(deployment)]);
          return deployment;
        });
      });
  }

  static create(data) {
    return this.cpanel.post(`tools/${data.tool_name}/deployments`, {});
  }

  restart() {
    return Pod.delete_all({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  get available() {
    return this.data.pods.some(pod => pod.status.phase === 'Running');
  }

  get idled() {
    return this.data.metadata.labels[IDLED_LABEL] === 'true';
  }

  get app_label() {
    return this.data.metadata.labels.app;
  }

  get username() { // eslint-disable-line class-methods-use-this
    return this.kubernetes.user.username.toLowerCase();
  }

  get url() {
    return `https://${this.username}-${this.app_label}.${config.cluster.tools_domain}`;
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
    const { status } = this;
    const reason = status.reason ? `: ${status.reason}` : '';
    return `${status.phase}${reason}`;
  }
}

exports.Pod = Pod;
