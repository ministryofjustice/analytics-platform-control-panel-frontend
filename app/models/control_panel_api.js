const { APIError } = require('../api_clients/base');
const base = require('./base');
const cls = require('cls-hooked');
const config = require('../config');
const { get_namespace } = require('../api_clients/kubernetes');


class DoesNotExist extends APIError {
  constructor(error, Model, id) {
    super(error);
    this.message = `${Model.name} not found with ${Model.pk} "${id}"`;
  }
}

exports.DoesNotExist = DoesNotExist;


class ModelSet extends base.ModelSet {
  exclude(other) {
    let others = other;
    if (other instanceof this.model) {
      others = [other];
    }

    const pks = others.map(instance => instance[this.model.pk]);

    return this.filter(instance => !pks.includes(instance[this.model.pk]));
  }
}


class Model extends base.Model {
  static get cpanel() {
    const ns = cls.getNamespace(config.continuation_locals.namespace);
    return ns.get('cpanel');
  }

  get cpanel() {
    return this.constructor.cpanel;
  }

  static get pk() {
    return 'id';
  }

  static list() {
    return this.cpanel.get(this.endpoint)
      .then(result => new ModelSet(this.prototype.constructor, result.results));
  }

  static create(data, options = {}) {
    const endpoint = options.endpoint || this.endpoint;
    return this.cpanel.post(endpoint, data)
      .then(response => new this.prototype.constructor(response));
  }

  static get(id) {
    return this.cpanel.get(`${this.endpoint}/${id}`)
      .then(data => new this.prototype.constructor(data))
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, id);
        }
        throw error;
      });
  }

  static delete(id) {
    return this.cpanel.delete(`${this.endpoint}/${id}`)
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          throw new DoesNotExist(error, this.prototype.constructor, id);
        }
        throw error;
      });
  }

  delete() {
    return this.constructor.delete(this[this.constructor.pk]);
  }

  create(options = {}) {
    if (this.endpoint) {
      options.endpoint = this.endpoint;
    }
    return this.constructor.create(this.data, options);
  }

  update() {
    const pk_name = this.constructor.pk;
    const pk = this.data[pk_name];

    if (pk !== undefined) {
      return this.cpanel.patch(`${this.constructor.endpoint}/${pk}`, this.data)
        .then(data => new this.constructor(data));
    }

    return Promise.reject(new Error(`Missing ${pk_name} for PATCH ${this.constructor.endpoint}`));
  }
}


class App extends Model {
  static get endpoint() {
    return 'apps';
  }

  get apps3buckets() {
    return new ModelSet(AppS3Bucket, this.data.apps3buckets);
  }

  get buckets() {
    return new ModelSet(Bucket, this.data.apps3buckets.map(as => as.s3bucket));
  }

  get users() {
    return new ModelSet(User, this.data.userapps.map(ua => ua.user));
  }

  get customers() {
    const pk = this.data[this.constructor.pk];

    return this.cpanel.get(`${this.constructor.endpoint}/${pk}/customers`)
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          return [];
        }
        throw error;
      });
  }

  grant_bucket_access(bucket, access_level = 'readonly') {
    if (!['readonly', 'readwrite'].includes(access_level)) {
      throw new Error(`Invalid access_level "${access_level}"`);
    }

    let bucket_id = bucket;

    if (typeof bucket === 'function' && bucket.prototype.constructor === Bucket) {
      bucket_id = bucket.id;
    }

    return new AppS3Bucket({
      app: this.id,
      s3bucket: bucket_id,
      access_level,
    }).create();
  }

  grant_user_access(user_id, access_level = 'readonly', is_admin = false) {
    if (!['readonly', 'readwrite'].includes(access_level)) {
      throw new Error(`Invalid access_level "${access_level}"`);
    }

    return new UserApp({
      app: this.id,
      user: user_id,
      access_level,
      is_admin,
    }).create();
  }

  add_customer(app_id, customer_email) {
    return this.cpanel.post(`${this.constructor.endpoint}/${app_id}/customers/`, { email: customer_email });
  }

  delete_customer(app_id, customer_id) {
    return this.cpanel.delete(`${this.constructor.endpoint}/${app_id}/customers/${customer_id}/`);
  }
}

exports.App = App;


class AppS3Bucket extends Model {
  static get endpoint() {
    return 'apps3buckets';
  }
}

exports.AppS3Bucket = AppS3Bucket;


class Bucket extends Model {
  static get endpoint() {
    return 's3buckets';
  }

  get apps() {
    return new ModelSet(App, this.data.apps3buckets.map(as => as.app));
  }

  get apps3buckets() {
    return new ModelSet(AppS3Bucket, this.data.apps3buckets);
  }

  get users() {
    return new ModelSet(User, this.data.users3buckets.map(us => us.user));
  }

  get users3buckets() {
    return new ModelSet(UserS3Bucket, this.data.users3buckets);
  }
}

exports.Bucket = Bucket;


class User extends Model {
  static get endpoint() {
    return 'users';
  }

  static get pk() {
    return 'auth0_id';
  }

  get apps() {
    return new ModelSet(App, this.data.userapps.map(ua => ua.app));
  }

  get buckets() {
    return new ModelSet(Bucket, this.data.users3buckets.map(us => us.s3bucket));
  }

  get users3buckets() {
    return new ModelSet(UserS3Bucket, this.data.users3buckets);
  }

  get kubernetes_namespace() {
    return get_namespace(this.data.username);
  }

  is_bucket_admin(bucket_id) {
    return this.users3buckets.filter(u => u.s3bucket.id === bucket_id && u.is_admin).length > 0;
  }

  is_app_admin(app_id) {
    return this.userapps.filter(u => u.app.id === app_id && u.is_admin).length > 0;
  }
}

exports.User = User;


class UserS3Bucket extends Model {
  static get endpoint() {
    return 'users3buckets';
  }
}

exports.UserS3Bucket = UserS3Bucket;


class UserApp extends Model {
  static get endpoint() {
    return 'userapps';
  }
}

exports.UserApp = UserApp;
