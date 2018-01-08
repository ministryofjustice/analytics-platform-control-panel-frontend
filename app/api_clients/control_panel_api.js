const { APIClient } = require('./base');
const config = require('../config');


class ControlPanelAPIClient extends APIClient {
  authenticate(user) {
    if (!user.id_token) {
      throw new Error('User has no id_token');
    }
    this.auth = {
      header: `JWT ${user.id_token || 'invalid token'}`,
    };
  }
}

exports.APIClient = ControlPanelAPIClient;

const api = new ControlPanelAPIClient(config.api);

exports.api = api;
