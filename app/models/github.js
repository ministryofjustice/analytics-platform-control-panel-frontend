const cls = require('cls-hooked');
const config = require('../config');
const { Model, ModelSet } = require('./base');


class Repo extends Model {
  static get github() {
    const ns = cls.getNamespace(config.continuation_locals.namespace);
    return ns.get('github');
  }

  get github() {
    return this.constructor.github;
  }

  static list(params = {}) {
    return Promise.all(config.github.orgs.map(org => this.github.repos.getForOrg({
      org,
      type: 'all',
      page: params.page || 1,
      per_page: params.per_page || 500,
    })))
      .then(results => new ModelSet(
        this.prototype.constructor,
        [].concat(...results.map(result => result.data)),
      ));
  }

  get org() {
    const name = this.data.full_name;
    const delimiter_pos = name.indexOf('/');
    if (delimiter_pos > 0) {
      return name.slice(0, delimiter_pos);
    }
    return null;
  }
}

exports.Repo = Repo;
