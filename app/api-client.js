const config = require('./config');
const request = require('request-promise');
const url = require('url');


const log = require('bole')('api-client');


class BasicAuth {

  constructor(username, password) {
    this.username = username
    this.password = password
  }

  get header() {
    return 'Basic ' + new Buffer(
      `${options.username}:${options.password}`).toString('base64');
  }

}


class JWTAuth {

  constructor(token) {
    this.token = token || 'invalid token';
  }

  set_token(token) {
    this.token = token;
  }

  unset_token() {
    this.token = 'invalid token';
  }

  get header() {
    return `JWT ${this.token}`;
  }

}


class APIClient {

  constructor(config) {
    this.base_url = config.base_url;
    this.auth = null;
  }

  request(endpoint, method = 'GET', body = null) {
    let headers = {};

    if (this.auth) {
      headers['Authorization'] = this.auth.header;
    }

    try {
      let options = {
        method: method,
        uri: this.endpoint_url(endpoint),
        headers: headers,
        body: body,
        json: true
      };
      return request(options)
        .then((result) => {
          log.debug(`${method} ${options.uri}`);
          //console.dir(result);
          return result;
        });

    } catch (error) {
      throw new Error(`API: ${method} ${endpoint} failed: ${error}`);
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body = '') {
    return this.request(endpoint, 'POST', body);
  }

  delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }

  patch(endpoint, body = '') {
    return this.request(endpoint, 'PATCH', body);
  }

  put(endpoint, body = '') {
    return this.request(endpoint, 'PUT', body);
  }

  endpoint_url(endpoint) {

    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    if (!endpoint.endsWith('/')) {
      endpoint += '/';
    }

    return url.resolve(this.base_url, endpoint);
  }

}


const api = new APIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;


const model_proxy = {
  get: (model, property) => {
    if (Reflect.has(model, property)) {
      return Reflect.get(model, property);
    }
    if (model.data && property in model.data) {
      return model.data[property];
    }
  }
}


class ModelSet extends Array {

  constructor(model, data = []) {
    super(...data.map(obj => new model(obj)));
    this.model = model;
  }

  exclude(other) {

    if (other instanceof this.model) {
      other = [other];
    }

    let pks = other.map(instance => instance[this.model.pk]);

    return this.filter((instance) => {
      return !pks.includes(instance[this.model.pk]);
    });
  }
}

exports.ModelSet = ModelSet;

class Model {

  constructor(data) {
    this.data = data;
    return new Proxy(this, model_proxy);
  }

  static get pk() {
    return 'id';
  }

  static list(filter = {}) {
    return api.get(this.endpoint)
      .then((result) => {
        return new ModelSet(this.prototype.constructor, result.results);
      });
  }

  static get(id) {
    return api.get(`${this.endpoint}/${id}`)
      .then(data => new this.prototype.constructor(data));
  }

  static delete(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  create() {
    return api.post(this.constructor.endpoint, this.data)
      .then(data => new this.constructor(data));
  }

  replace() {
    const endpoint = this.constructor.endpoint;
    const pk_name = this.constructor.pk;
    const pk = this.data[pk_name];

    if (pk !== undefined) {
      return api.put(`${endpoint}/${pk}`, this.data)
        .then(data => new this.constructor(data));
    }

    return Promise.reject({error: `Missing ${pk_name} for PUT ${endpoint}`});
  }

  update() {
    const endpoint = this.constructor.endpoint;
    const pk_name = this.constructor.pk;
    const pk = this.data[pk_name];

    if (pk !== undefined) {
      return api.patch(`${endpoint}/${pk}`, this.data)
        .then(data => new this.constructor(data));
    }

    return Promise.reject({error: `Missing ${pk_name} for PATCH ${endpoint}`});
  }

}


class AppS3Bucket extends Model {
  static get endpoint() {
    return 'apps3buckets';
  }
}

exports.AppS3Bucket = AppS3Bucket;


class UserS3Bucket extends Model {
  static get endpoint() {
    return 'users3buckets';
  }
}

exports.UserS3Bucket = UserS3Bucket;


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

  connect_bucket(bucket, access_level = 'readonly') {

    if (!['readonly', 'readwrite'].includes(access_level)) {
      throw new Error(`Invalid access_level "${access_level}"`);
    }

    let bucket_id = bucket;

    if (typeof bucket === 'function' && bucket.prototype.constructor == Bucket) {
      bucket_id = bucket.id;
    }

    return new AppS3Bucket({
      app: this.id,
      s3bucket: bucket_id,
      access_level: access_level
    }).create()
  }
}

exports.App = App;

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


api.connect_bucket_to_app = (apps3bucket) => {
  return api.post('apps3buckets', body = apps3bucket);
};
