"use strict";
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

      return apps.list()
        .then(function (apps) { assert.deepEqual(apps, response); });
    });
  });


  describe('add_app', function () {

    it('throws an error if no app data is provided', function () {
      var response = {
        "name": ["This field is required."],
        "repo_url": ["This field is required."],
        "apps3buckets": ["This field is required."],
        "userapps": ["This field is required."]
      };

      mock_api
        .post('/apps', JSON.stringify({}))
        .reply(400, response);

      return apps.add({})
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, response); });
    });

    it('throws an error if incomplete app data is provided', function () {
      var incomplete_app_data = {'name': 'Test app'};
      var response = {
        "repo_url": ["This field is required."],
        "apps3buckets": ["This field is required."],
        "userapps": ["This field is required."]
      };

      mock_api
        .post('/apps', JSON.stringify(incomplete_app_data))
        .reply(400, response);

      return apps.add(incomplete_app_data)
        .then(function (data) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, response); });
    });

    it('returns an app id after creating the app', function () {

      var test_app = {
        'name': 'Test app',
        'repo_url': 'https://github.com/moj-analytical-services/test-app',
        'app_s3_buckets': [],
        'userapps': []
      };

      var expected_id = 4;

      var response = {
        "id": expected_id,
        "url": "http://localhost:8000/apps/" + expected_id + "/",
        "name": test_app.name,
        "slug": "test-app",
        "repo_url": test_app.repo_url,
        "iam_role_name": "dev_app_test-app",
        "created_by": "github|12345",
        "apps3buckets": [],
        "userapps": []
      };

      mock_api
        .post('/apps', JSON.stringify(test_app))
        .reply(201, response);

      return apps.add(test_app)
        .then(function (app) { assert.equal(app.id, expected_id); });
    });

  });

});
