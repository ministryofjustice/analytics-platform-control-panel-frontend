const request = require('request-promise');
const url = require('url');


const log = require('bole')('api-client');


class APIError extends Error {
  constructor(error) {
    super(error.message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(error.message)).stack;
    }
  }
}

exports.APIError = APIError;


class APIForbidden extends APIError {
  constructor(error) {
    super(error);
    this.message = `${error.response.request.method} ${error.response.request.path} was not permitted`;
    if (error.error && error.error.detail) {
      this.message += `: ${error.error.detail}`;
    }
  }
}

exports.APIForbidden = APIForbidden;


class APIClient {
  constructor(conf) {
    this.conf = conf;
    this.auth = null;
  }

  request(endpoint, { method = 'GET', body = null, params = {} } = {}) {
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
        .then(result => result)
        .catch((error) => {
          log.error(`${method} ${options.uri} ${error.statusCode || 'errored'}`);
          log.error(`Query: ${JSON.stringify(params, null, 2)}`);
          log.error(`Body: ${JSON.stringify(body, null, 2)}`);
          if (error.statusCode && error.statusCode === 403) {
            throw new APIForbidden(error);
          }
          throw error;
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
    return this.request(endpoint, { method: 'PATCH', body });
  }

  endpoint_url(endpoint) {
    if (!endpoint) {
      throw new Error('Missing endpoint');
    }

    let suffix = '';
    if (!endpoint.endsWith('/')) {
      suffix = '/';
    }

    return url.resolve(this.conf.base_url, endpoint + suffix);
  }
}

exports.APIClient = APIClient;
