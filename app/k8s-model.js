const { Model, ModelSet } = require('./base-model');
const { api } = require('./k8s-api-client');


class K8sModel extends Model {
  static list(params = {}) {
    return api.get(this.endpoint, params)
      .then(result => new ModelSet(this.prototype.constructor, result.items));
  }

  static get(name) {
    return api.get(`${this.endpoint}/${name}`)
      .then(data => new this.prototype.constructor(data));
  }

  static delete_all(params = {}) {
    return api.delete(this.endpoint, params);
  }
}


exports.K8sModel = K8sModel;
