const { APIClient, APIError } = require('./base');
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

  request(endpoint, { method = 'GET', body = null, params = {} } = {}) {
    return super.request(endpoint, { method, body, params })
      .catch((error) => {
        if (DjangoError.match(error)) {
          throw new DjangoError(error);
        }
        throw error;
      });
  }
}

exports.APIClient = ControlPanelAPIClient;

const api = new ControlPanelAPIClient(config.api);

exports.api = api;


class DjangoError extends APIError {
  constructor(error) {
    super(error);
    this.original_message = this.message;
  }

  static match(error) {
    return error.message && error.message.indexOf('Traceback:') >= 0;
  }

  get python_traceback() {
    const pattern = /\\nTraceback:  \\n\\n(.*)\\n\\nException Type/;
    const match = this.original_message.match(pattern);
    const traceback = match[1]
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .split(/\n\n/);

    return traceback.map((line) => {
      const pattern = /^File "([^"]+)" in ([^\n]+)[^0-9]+([0-9]+). ([^\n]+)/;
      const [ _, file, func, line_no, code ] = line.match(pattern);
      return { file, func, line_no, code };
    });
  }

  get message() {
    const pattern = /500 - "(.*)\\n\\nRequest Method:/;
    const match = this.original_message.match(pattern);
    return match[1].replace(/\\n/g, '\n');
  }
}

exports.DjangoError = DjangoError;
