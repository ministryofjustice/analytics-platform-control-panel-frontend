"use strict";
require('./conftest.js');
var assert = require('chai').assert;
var nock = require('nock');

var apps = require('../app/api-client.js').apps;


var mock_api = nock('http://localhost:8000');


describe('Apps API', function () {

  describe('list_apps', function () {

    it('returns a list of apps', function () {
      var response = require('./test-apps-response');

      mock_api
        .get('/apps')
        .reply(200, response);

      assert.eventually.deepEqual(apps.list(), response);
    });

  });


  describe('add_app', function () {

    it('throws an error if no app data is provided', function () {

      mock_api
        .post('/apps', JSON.stringify({}))
        .reply(400, {'error': 'No app data provided'});

      assert.isRejected(apps.add({}));
    });

    it('throws an error if incomplete app data is provided', function () {
      var incomplete_app_data = {'name': 'Test app'};

      mock_api
        .post('/apps', JSON.stringify(incomplete_app_data))
        .reply(400, {'error': 'Incomplete app data provided'});

      assert.isRejected(apps.add(incomplete_app_data));
    });

    it('returns a app id after creating the app', function () {

      var test_app = {
        'name': 'Test app',
        'repo_url': 'https://github.com/moj-analytical-services/test-app',
        'app_s3_buckets': []
      };

      var current_user_id = null;

      var response ={
        'id': 1,
        'name': test_app.name,
        'repo_url': test_app.repo_url,
        'app_s3_buckets': [],
        'created_by': current_user_id
      };

      mock_api
        .post('/apps', JSON.stringify(test_app))
        .reply(201, response);

      assert.eventually.propertyVal(apps.add(test_app), 'id', 1);

    });

  });

});
