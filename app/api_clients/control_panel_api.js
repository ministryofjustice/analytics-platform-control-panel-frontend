const log = require('bole')('control_panel_api');
const passport = require('passport');
const { APIClient, APIError } = require('./base');


class ControlPanelAPIClient extends APIClient {
  authenticate(user) {
    if (!user.id_token) {
      throw new Error('User has no id_token');
    }
    this.user = user;
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
        if (ExpiredToken.match(error)) {
          log.info('token expired, refreshing');
          return ExpiredToken.refresh(this.user)
            .then((tokenset) => {
              this.user.id_token = tokenset.id_token;
              this.user.access_token = tokenset.access_token;
              this.authenticate(this.user);
              return this.request(endpoint, { method, body, params });
            });
        }
        throw error;
      });
  }
}

exports.ControlPanelAPIClient = ControlPanelAPIClient;


class DjangoError extends APIError {
  constructor(error) {
    super(error);
    this.original_message = this.message;
    const pattern = /500 - "(.*)Request Method:/;
    const match = this.original_message.match(pattern);
    this.message = match[1]
      .trim()
      .replace(/\\n/g, '<br>\n');
  }

  static match(error) {
    return error.message && error.message.indexOf('Traceback:') >= 0;
  }

  get python_traceback() {
    if (!this.original_message) {
      return [];
    }
    let pattern = /Traceback:(.*)Exception Type/;
    let match = this.original_message.match(pattern);
    const traceback = match[1]
      .replace(/\\n/g, '\n')
      .trim()
      .replace(/\\"/g, '"')
      .split(/\n\n/);

    return traceback.map((line) => {
      pattern = /^File "([^"]+)" in ([^\n]+)[^0-9]+([0-9]+). ([^\n]+)/;
      match = line.match(pattern);
      if (match) {
        const [file, func, line_no, code] = match.slice(1);
        return { file, func, line_no, code };
      }

      return line;
    });
  }
}

exports.DjangoError = DjangoError;


class ExpiredToken extends APIError {
  static match(error) {
    return error.message && error.message.indexOf('Signature has expired') >= 0;
  }

  static refresh(user) {
    // XXX this depends on a private API and should be improved
    const client = passport._strategy('oidc')._client; // eslint-disable-line no-underscore-dangle
    return client.refresh(user.refresh_token);
  }
}

exports.ExpiredToken = ExpiredToken;
