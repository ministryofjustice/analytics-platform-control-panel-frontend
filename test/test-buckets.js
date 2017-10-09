"use strict";
require('./conftest.js');
var assert = require('chai').assert;
var nock = require('nock');

var buckets = require('../lib/api-client.js').buckets;


var mock_api = nock('http://localhost:8000');


describe('buckets API', function () {

  describe('list()', function () {

    it('returns a list of buckets', function () {
      var response = require('./test-buckets-response');

      mock_api
        .get('/s3buckets')
        .reply(200, response);

      assert.eventually.deepEqual(buckets.list(), response);
    });

  });


  describe('add()', function () {

    it('throws an error if no bucket data is provided', function () {
      var error = {
        'name': ['This field is required.'],
        'apps3buckets': ['This field is required.']
      };

      mock_api
        .post('/s3buckets', JSON.stringify({}))
        .reply(400, error);

      assert.isRejected(buckets.add({}), error);
    });

    it('throws an error if incomplete bucket data is provided', function () {
      var incomplete_bucket_data = {'name': 'Test bucket'};
      var error = {
        'apps3buckets': ['This field is required.']
      };

      mock_api
        .post('/s3buckets', JSON.stringify(incomplete_bucket_data))
        .reply(400, error);

      assert.isRejected(buckets.add(incomplete_bucket_data), error);
    });

    it('returns a bucket id after creating the bucket', function () {

      var test_bucket = {
        'name': 'Test bucket',
        'apps3buckets': []
      };

      var current_user_id = null;

      var response ={
        'id': 1,
        'name': test_bucket.name,
        'apps3buckets': [],
        'created_by': current_user_id
      };

      mock_api
        .post('/s3buckets', JSON.stringify(test_bucket))
        .reply(201, response);

      assert.eventually.propertyVal(buckets.add(test_bucket), 'id', 1);

    });

  });

});
