"use strict";
const { assert } = require('chai');
const { mock_api } = require('./conftest');

const { api } = require('../app/api_clients/control_panel_api');
const { App, ModelSet } = require('../app/models');


describe('API Client', () => {

  describe('request', () => {

    it('rejects an invalid auth token', () => {
      const reason = {
        'detail': 'Authentication credentials were not provided.'};
      const expected = 'GET /apps/ was not permitted: Authentication credentials were not provided.';

      mock_api()
        .get('/apps/')
        .matchHeader('Authorization', 'JWT invalid token')
        .reply(403, reason);

      return App.list()
        .then((apps) => { throw new Error('expected failure'); })
        .catch((err) => { assert.equal(err.message, expected); });
    });

    it('accepts a valid auth token', () => {
      const valid_token = 'invalid JWT';
      const response = {
        'count': 0,
        'next': null,
        'previous': null,
        'results': []
      };

      mock_api()
        .get('/apps/')
        .matchHeader('Authorization', 'JWT ' + valid_token)
        .reply(200, response);

      api.authenticate({ type: 'jwt', token: valid_token });

      const expected = new ModelSet(App, response.results);

      return App.list()
        .then((apps) => { assert.deepEqual(apps, expected); });
    });

  });

});
