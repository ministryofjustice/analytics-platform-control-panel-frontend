const { api } = require('../api_clients/kubernetes');
const base = require('./base');


class Model extends base.Model {
  static list(params = {}) {
    return api.get(this.endpoint, params)
      .then(result => new base.ModelSet(this.prototype.constructor, result.items));
  }

  static get(name) {
    return api.get(`${this.endpoint}/${name}`)
      .then(data => new this.prototype.constructor(data));
  }

  static delete_all(params = {}) {
    return api.delete(this.endpoint, params);
  }
}

exports.Model = Model;


class Deployment extends Model {
  static get endpoint() {
    return 'deployments';
  }

  static restart(label) {
    return Pod.delete_all({ labelSelector: `app=${label}` });
  }

  get_pods() {
    return Pod.list({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  restart() {
    return Pod.delete_all({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  get_status() {
    for (let condition of this.status.conditions) {
      if (condition.type === 'Available') {
        if (condition.status === 'True') {
          return 'Available';
        } else {
          return 'Unavailable';
        }
      }
    }
    return 'Unknown';
  }
}

exports.Deployment = Deployment;


class Pod extends Model {
  static get endpoint() {
    return 'pods';
  }

  get display_status() {
    // based on
    // https://github.com/kubernetes/dashboard/blob/91c54261c6a3d7f601c67a2ccfbbe79f3b6a89f9/src/app/frontend/pod/list/card_component.js#L98

    let containerStatus = this.data.status.containerStatuses;

    if (containerStatus) {
      let state = containerStatus[0].state;

      if (state.waiting) {
        return `Waiting: ${state.waiting.reason}`;
      }

      if (state.terminated) {
        let reason = state.terminated.reason;

        if (!reason) {
          if (state.terminated.signal) {
            reason = `Signal:${state.terminated.signal}`;
          } else {
            reason = `ExitCode:${state.terminated.exitCode}`;
          }
        }

        return `Terminated: ${reason}`;
      }
    }

    return this.data.status.phase;
  }
}

exports.Pod = Pod;
