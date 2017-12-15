const config = require('../config');
const { Model, ModelSet } = require('./base');
const { api } = require('../api_clients/github');


class Repo extends Model {
  static list(params = {}) {
    return api.repos.getAll(params)
      .then((result) => {
        return new ModelSet(this.prototype.constructor, result.data);
      });
  }
}

exports.Repo = Repo;
