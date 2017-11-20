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
          console.log(`${method} ${options.uri}`);
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
    if (property in model.data) {
      return model.data[property];
    }
  }
}


class ModelSet extends Array {

  constructor(model, data = []) {
    super(...data.map((obj) => {
      const model_obj = new model(obj);
      return new Proxy(model_obj, model_proxy);
    }));
  }

}


class Model {

  constructor(data) {
    this.data = data;
  }

  static list(filter = {}) {
    return api.get(this.endpoint)
      .then((result) => {
        return new ModelSet(this.prototype.constructor, result.results);
      });
  }

  static get(id) {
    return api.get(`${this.endpoint}/${id}`)
      .then((result) => {
        const model_obj = new this.prototype.constructor(result);
        return new Proxy(model_obj, model_proxy);
      });
  }

  save() {
    return api.post(this.endpoint, this.data);
  }

}


class AppS3Bucket extends Model {
  static get endpoint() {
    return 'apps3buckets';
  }
}


class User extends Model {
  static get endpoint() {
    return 'users';
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
}

exports.App = App;

class Bucket extends Model {
  static get endpoint() {
    return 's3buckets';
  }
}

exports.Bucket = Bucket;


api.list_users = () => User.list();

api.get_user = id => User.get(id);

api.add_user = user => user.save();

api.list_apps = () => App.list();

api.list_user_apps = (user_id) => {
  return api.get(`users/${user_id}/apps`);
};

api.get_app = id => App.get(id);

api.add_app = app => app.save();

api.connect_bucket_to_app = (apps3bucket) => {
  return api.post('apps3buckets', body = apps3bucket);
};

api.apps = {
  list: api.list_apps,
  get: api.get_app,
  add: api.add_app,
  connect_bucket: api.connect_bucket_to_app,
};

api.list_buckets = () => Bucket.list();

api.list_app_buckets = (app_id) => {
  return api.get(`apps/${app_id}/s3buckets`);
};

api.list_user_buckets = (user_id) => {
  return api.get(`users/${user_id}/s3buckets`);
};

api.get_bucket = id => Bucket.get(id);

api.add_bucket = bucket => bucket.save();

api.buckets = {
  'list': api.list_buckets,
  'get': api.get_bucket,
  'add': api.add_bucket
};
