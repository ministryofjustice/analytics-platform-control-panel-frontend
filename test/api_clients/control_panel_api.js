

const { assert } = require('chai');
const { config, mock_api } = require('../conftest');

const { ControlPanelAPIClient } = require('../../app/api_clients/control_panel_api');
const { App, ModelSet } = require('../../app/models');


describe('Control Panel API Client', () => {
  const client = new ControlPanelAPIClient(config.api);

  it('rejects an invalid auth token', () => {
    const reason = { detail: 'Authentication credentials were not provided.' };
    const expected = 'GET /apps/ was not permitted: Authentication credentials were not provided.';
    const id_token = 'invalid token';

    const request = mock_api()
      .get('/apps/')
      .matchHeader('Authorization', `JWT ${id_token}`)
      .reply(403, reason);

    client.authenticate({ id_token });

    return client.get('apps')
      .then((response) => {
        throw new Error('expected failure');
      })
      .catch((error) => {
        assert(request.isDone());
        assert.equal(error.message, expected);
      });
  });

  it('throws an exception if the user has no id token', () => {
    assert.throws(
      () => { client.authenticate({ id_token: undefined }); },
      Error,
      'User has no id_token',
    );
  });

  it('accepts a valid auth token', () => {
    const id_token = 'valid JWT';
    const apps_response = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    const request = mock_api()
      .get('/apps/')
      .matchHeader('Authorization', `JWT ${id_token}`)
      .reply(200, apps_response);

    client.authenticate({ id_token });

    return client.get('apps')
      .then((response) => { assert.deepEqual(response, apps_response); });
  });
});
