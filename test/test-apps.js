"use strict";
const { assert } = require('chai');
const { mock_api } = require('./conftest');
const { App, ModelSet } = require('../app/models');


describe('Apps API', () => {

  describe('list_apps', () => {

    it('returns a list of apps', () => {
      const apps_response = require('./fixtures/apps');
      const expected = new ModelSet(App, apps_response.results);

      mock_api()
        .get('/apps/')
        .reply(200, apps_response);

      return App.list()
        .then((apps) => {
          assert.deepEqual(apps, expected);
        });
    });
  });


  describe('add_app', () => {

    it('throws an error if no app data is provided', () => {
      const response = {
        "name": ["This field is required."],
        "repo_url": ["This field is required."],
        "apps3buckets": ["This field is required."],
        "userapps": ["This field is required."]
      };

      mock_api()
        .post('/apps/', JSON.stringify({}))
        .reply(400, response);

      return new App({}).create()
        .then((data) => { throw new Error('expected failure'); })
        .catch((err) => { assert.deepEqual(err.error, response); });
    });

    it('throws an error if incomplete app data is provided', () => {
      const incomplete_app_data = {'name': 'Test app'};
      const response = {
        "repo_url": ["This field is required."],
        "apps3buckets": ["This field is required."],
        "userapps": ["This field is required."]
      };

      mock_api()
        .post('/apps/', JSON.stringify(incomplete_app_data))
        .reply(400, response);

      return new App(incomplete_app_data).create()
        .then((data) => { throw new Error('expected failure'); })
        .catch((err) => { assert.deepEqual(err.error, response); });
    });

    it('returns an app id after creating the app', () => {

      const test_app = {
        'name': 'Test app',
        'repo_url': 'https://github.com/moj-analytical-services/test-app',
        'app_s3_buckets': [],
        'userapps': []
      };

      const expected_id = 4;

      const response = {
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

      mock_api()
        .post('/apps/', JSON.stringify(test_app))
        .reply(201, response);

      return new App(test_app).create()
        .then((app) => { assert.equal(app.id, expected_id); });
    });

  });

});
