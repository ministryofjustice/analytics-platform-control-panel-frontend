const config = require('./config');
const request = require('request-promise');
const url = require('url');


const log = require('bole')('api-client');


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

exports.JWTAuth = JWTAuth;


class APIClient {
  constructor(conf) {
    this.base_url = conf.base_url;
    this.auth = null;
  }

  request(endpoint, { method='GET', body=null, params={} } = {}) {
    const headers = {};

    if (this.auth) {
      headers.Authorization = this.auth.header;
    }

    try {
      const options = {
        method,
        uri: this.endpoint_url(endpoint),
        headers,
        body,
        qs: params,
        json: true,
      };
      log.debug(`${method} ${options.uri}`);
      return request(options)
        .then((result) => {
          // console.dir(result);
          return result;
        });
    } catch (error) {
      throw new Error(`API: ${method} ${endpoint} failed: ${error}`);
    }
  }

  get(endpoint, params = {}) {
    return this.request(endpoint, { params });
  }

  post(endpoint, body = '') {
    return this.request(endpoint, { method: 'POST', body });
  }

  delete(endpoint, params = {}) {
    return this.request(endpoint, { method: 'DELETE', params });
  }

  patch(endpoint, body = '') {
    return this.request(endpoint, { method: 'PATCH', body});
  }

  put(endpoint, body = '') {
    return this.request(endpoint, { method: 'PUT', body});
  }

  endpoint_url(endpoint) {
    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    let suffix = '';
    if (!endpoint.endsWith('/')) {
      suffix = '/';
    }

    return url.resolve(this.base_url, endpoint + suffix);
  }
}

exports.APIClient = APIClient;

const api = new APIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;
