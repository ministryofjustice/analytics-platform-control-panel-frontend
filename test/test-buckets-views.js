"use strict";
var assert = require('chai').assert;
var config = require('../app/config');
var mock = require('./mock');
var handlers = require('../app/buckets/handlers');


describe('buckets view', function () {

  describe('add bucket', function () {

    it('creates a new bucket and redirects', function () {
      var bucket_data = {
        'new-datasource-name': 'dev-test-bucket'
      };
      var created_bucket = {
        id: 1,
        url: config.api.base_url + '/s3buckets/1/',
        name: 'dev-test-bucket',
        arn: 'arn:aws:s3:::dev-test-bucket',
        apps3buckets: [],
        created_by: 'github|12345'
      };

      mock.api
        .post('/s3buckets/')
        .reply(201, created_bucket);

      var req = {};
      var res = {};
      var request = new Promise(function (resolve, reject) {

        function unexpected(template, options) {
          options = JSON.stringify(options);
          reject(new Error(
            `expected redirect, got rendered template ${template}, ${options}`));
        }

        req.body = bucket_data;
        res.redirect = resolve;
        res.render = unexpected;
        handlers.create_bucket[1](req, res, reject);
      });

      return request
        .then(function (redirect_url) {
          assert.equal(redirect_url, mock.url_for('buckets.details', {id: created_bucket.id}));
        });
    });

  });

});
