"use strict";
const { assert } = require('chai');

const { config, mock_api, url_for } = require('./conftest');
const handlers = require('../app/buckets/handlers');


describe('buckets view', () => {

  describe('add bucket', () => {

    it('creates a new bucket and redirects', () => {
      const bucket_data = {
        'new-datasource-name': 'dev-test-bucket'
      };
      const created_bucket = {
        id: 1,
        url: config.api.base_url + '/s3buckets/1/',
        name: 'dev-test-bucket',
        arn: 'arn:aws:s3:::dev-test-bucket',
        apps3buckets: [],
        created_by: 'github|12345'
      };

      mock_api()
        .post('/s3buckets/')
        .reply(201, created_bucket);

      const req = {};
      const res = {};
      const request = new Promise((resolve, reject) => {

        function unexpected(template, options) {
          options = JSON.stringify(options);
          reject(new Error(
            `expected redirect, got rendered template ${template}, ${options}`));
        }

        req.body = bucket_data;
        res.redirect = resolve;
        res.render = unexpected;
        handlers.create_bucket(req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert.equal(redirect_url, url_for('buckets.details', { id: created_bucket.id }));
        });
    });

  });

});
