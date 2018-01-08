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
    return model.data[property] = value;
  }
};


class Model {
  constructor(data) {
    this.data = data;
    return new Proxy(this, model_proxy);
  }
}

exports.Model = Model;


class ModelSet extends Array {
  constructor(ModelConstructor, data = []) {
    super(...data.map(obj => new ModelConstructor(obj)));
    Object.defineProperty(this, 'model', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: ModelConstructor
    });
  }
}

exports.ModelSet = ModelSet;
