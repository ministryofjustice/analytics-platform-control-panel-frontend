const config = require('../config');
const { Model, ModelSet } = require('./base');
const github = require('../api_clients/github');


class Repo extends Model {
  static list(params = {}) {
    return Promise.all(config.github.orgs.map(org => github.api.repos.getForOrg({
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
  }
}

exports.Repo = Repo;
