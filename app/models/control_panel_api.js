const { APIError } = require('../api_clients/base');
const { api } = require('../api_clients/control_panel_api');
const base = require('./base');


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

  has_admin(user_id) {
    return true; // TODO: remove this and return real value once perms have been implemented
    // return this.data.userapps.some(ua => ua.is_admin && ua.user.auth0_id === user_id);
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

  has_admin(user_id) {
    return true; // TODO: remove this and return real value once perms have been implemented
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
