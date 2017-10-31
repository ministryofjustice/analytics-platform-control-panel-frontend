"use strict";
var assert = require('chai').assert;
var nock = require('nock');

var buckets = require('../app/api-client.js').buckets;


var mock_api = nock('http://localhost:8000');


describe('buckets API', function () {

  describe('list()', function () {

    it('returns a list of buckets', function () {
      var response = require('./test-buckets-response');

      mock_api
        .get('/s3buckets/')
        .reply(200, response);

      return buckets.list()
        .then(function (buckets) { assert.deepEqual(buckets, response); });
    });
  });


  describe('add()', function () {

    it('throws an error if no bucket data is provided', function () {
      var error = {
        'name': ['This field is required.'],
        'apps3buckets': ['This field is required.']
      };

      mock_api
        .post('/s3buckets/', JSON.stringify({}))
        .reply(400, error);

      return buckets.add({})
        .then(function (_) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('throws an error if incomplete bucket data is provided', function () {
      var incomplete_bucket_data = {'name': 'Test bucket'};
      var error = {
        'apps3buckets': ['This field is required.']
      };

      mock_api
        .post('/s3buckets/', JSON.stringify(incomplete_bucket_data))
        .reply(400, error);

      return buckets.add(incomplete_bucket_data)
        .then(function (_) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('throws an error if invalid bucket name is provided', function () {
      var invalid_bucket_data = {
        'name': 'bad bucket name',
        'apps3buckets': []
      };
      var error = {
        'name': ['Name must have correct env prefix e.g. dev-bucketname']
      };

      mock_api
        .post('/s3buckets/', JSON.stringify(invalid_bucket_data))
        .reply(400, error);

      return buckets.add(invalid_bucket_data)
        .then(function (_) { throw new Error('expected failure'); })
        .catch(function (err) { assert.deepEqual(err.error, error); });
    });

    it('returns a bucket id after creating the bucket', function () {

      var test_bucket = {
        'name': 'dev-test-bucket',
        'apps3buckets': []
      };

      var expected_id = 1;

      var response = {
        "id": expected_id,
        "url": "http://" + expected_id + "/s3buckets/1/",
        "name": "dev-test-bucket",
        "arn": "arn:aws:s3:::dev-test-bucket",
        "apps3buckets": [],
        "created_by": "github|12345"
      };

      mock_api
        .post('/s3buckets/', JSON.stringify(test_bucket))
        .reply(201, response);

      return buckets.add(test_bucket)
        .then(function (bucket) { assert.equal(bucket.id, expected_id); });
    });

  });

});
