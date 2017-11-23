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


class APIClient {
  constructor(conf) {
    this.base_url = conf.base_url;
    this.auth = null;
  }

  request(endpoint, method = 'GET', body = null) {
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
        json: true,
      };
      return request(options)
        .then((result) => {
          log.debug(`${method} ${options.uri}`);
          // console.dir(result);
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

    let suffix = '';
    if (!endpoint.endsWith('/')) {
      suffix = '/';
    }

    return url.resolve(this.base_url, endpoint + suffix);
  }
}


const api = new APIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;
