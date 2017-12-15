const { APIClient } = require('./base');
const config = require('../config');



class JWTAuth {
  constructor(token) {
    this.token = token || 'invalid token';
  }

  get header() {
    return `JWT ${this.token}`;
  }
}


class ControlPanelAPIClient extends APIClient {
  constructor(conf) {
    super(conf);
    this.supported_auth_types = [
      'jwt',
    ];
  }

  authenticate(options) {
    super.authenticate(options);

    const { type, token } = options;

    if (type === 'jwt') {
      if (!token) {
        throw new Error('Token authentication requires a token');
      }
      this.auth = new JWTAuth(token);
    }
  }
}

exports.APIClient = ControlPanelAPIClient;

const api = new ControlPanelAPIClient(config.api);
api.auth = new JWTAuth();

exports.api = api;
