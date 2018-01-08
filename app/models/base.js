const { APIError, api } = require('../api-client');


const model_proxy = {
  get: (model, property) => {
    if (Reflect.has(model, property)) {
      return Reflect.get(model, property);
    }
    if (model.data && property in model.data) {
      return model.data[property];
    }
    return undefined;
  },

  set: (model, property, value) => {
    if (Reflect.has(model, property)) {
      return Reflect.set(model, property, value);
    }
    model.data[property] = value;
    return true;
  }
};


class ModelSet extends Array {
  constructor(ModelConstructor, data = []) {
    super(...data.map(obj => new ModelConstructor(obj)));
    this.model = ModelConstructor;
  }

  exclude(other) {
    let others = other;
    if (other instanceof this.model) {
      others = [other];
    }

    const pks = others.map(instance => instance[this.model.pk]);

    return this.filter(instance => !pks.includes(instance[this.model.pk]));
  }
}


exports.ModelSet = ModelSet;


class DoesNotExist extends APIError {
  constructor(error, Model, id) {
    super(error);
    this.message = `${Model.name} not found with ${Model.pk} "${id}"`;
  }
}

exports.DoesNotExist = DoesNotExist;


class Model {
  constructor(data) {
    this.data = data;
    return new Proxy(this, model_proxy);
  }

  static get pk() {
    return 'id';
  }

  static list() {
    return api.get(this.endpoint)
      .then(result => new ModelSet(this.prototype.constructor, result.results));
  }

  static get(id) {
    return api.get(`${this.endpoint}/${id}`)
      .then(data => new this.prototype.constructor(data))
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, id);
        }
        throw error;
      });
  }

  static delete(id) {
    return api.delete(`${this.endpoint}/${id}`)
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, id);
        }
        throw error;
      });
  }

  create() {
    return api.post(this.constructor.endpoint, this.data)
      .then(data => new this.constructor(data));
  }

  replace() {
    const pk_name = this.constructor.pk;
    const pk = this.data[pk_name];

    if (pk !== undefined) {
      return api.put(`${this.constructor.endpoint}/${pk}`, this.data)
        .then(data => new this.constructor(data));
    }

    return Promise.reject(new Error(`Missing ${pk_name} for PUT ${this.constructor.endpoint}`));
  }

  update() {
    const pk_name = this.constructor.pk;
    const pk = this.data[pk_name];

    if (pk !== undefined) {
      return api.patch(`${this.constructor.endpoint}/${pk}`, this.data)
        .then(data => new this.constructor(data));
    }

    return Promise.reject(new Error(`Missing ${pk_name} for PATCH ${this.constructor.endpoint}`));
  }
}

exports.Model = Model;
