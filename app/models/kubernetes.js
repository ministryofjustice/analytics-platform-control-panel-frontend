const { api } = require('../api_clients/control_panel_api');
const kubernetes = require('../api_clients/kubernetes');
const base = require('./base');


class Model extends base.Model {
  static list(params = {}) {
    return kubernetes.api.get(this.endpoint, params)
      .then(result => new base.ModelSet(this.prototype.constructor, result.items));
  }

  static get(name) {
    return kubernetes.api.get(`${this.endpoint}/${name}`)
      .then(data => new this.prototype.constructor(data));
  }

  static delete_all(params = {}) {
    return kubernetes.api.delete(this.endpoint, params);
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
    for (const condition of this.status.conditions) {
      if (condition.type === 'Available') {
        if (condition.status === 'True') {
          return 'Available';
        }
        return 'Unavailable';
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
    const containerStatus = this.data.status.containerStatuses;

    if (containerStatus) {
      const { state } = containerStatus[0];

      if (state.waiting) {
        return `Waiting: ${state.waiting.reason}`;
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

        return `Terminated: ${reason}`;
      }
    }

    return this.data.status.phase;
  }
}

exports.Pod = Pod;


class Tool {
  static list() {
    return Promise
      .all([Deployment.list(), Pod.list()])
      .then(([tools, pods]) => {
        const tools_lookup = {};

        tools.forEach((tool) => {
          tools_lookup[tool.metadata.labels.app] = tool;
          tool.pods = [];
        });

        pods.forEach((pod) => {
          const tool = tools_lookup[pod.metadata.labels.app];
          if (tool) {
            tool.pods.push(pod);
          }
        });

        return tools;
      });
  }
}

exports.Tool = Tool;


class ToolDeployment {
  constructor(data) {
    this.tool_name = data.tool_name;
  }

  create() {
    return api.post(this.endpoint, {});
  }

  get endpoint() {
    return `tools/${this.tool_name}/deployments`;
  }
}

exports.ToolDeployment = ToolDeployment;
