"use strict";
const { assert } = require('chai');
const { mock_api } = require('./conftest');
const { Bucket, ModelSet } = require('../app/models');


describe('buckets API', () => {

  describe('list()', () => {

    it('returns a list of buckets', () => {
      const buckets_response = require('./fixtures/buckets');

      mock_api()
        .get('/s3buckets/')
        .reply(200, buckets_response);

      const expected = {
        'buckets': new ModelSet(Bucket, buckets_response.results),
      };

      return Bucket.list()
        .then((buckets) => {
          assert.deepEqual(buckets, expected.buckets);
        });
    });
  });


  describe('add()', () => {

    it('throws an error if no bucket data is provided', () => {
      const error = {
        'name': ['This field is required.'],
        'apps3buckets': ['This field is required.']
      };

      mock_api()
        .post('/s3buckets/', JSON.stringify({}))
        .reply(400, error);

      return new Bucket({}).create()
        .then((_) => { throw new Error('expected failure'); })
        .catch((err) => { assert.deepEqual(err.error, error); });
    });

    it('throws an error if incomplete bucket data is provided', () => {
      const incomplete_bucket_data = {'name': 'Test bucket'};
      const error = {
        'apps3buckets': ['This field is required.']
      };

      mock_api()
        .post('/s3buckets/', JSON.stringify(incomplete_bucket_data))
        .reply(400, error);

      return new Bucket(incomplete_bucket_data).create()
        .then((_) => { throw new Error('expected failure'); })
        .catch((err) => { assert.deepEqual(err.error, error); });
    });

    it('throws an error if invalid bucket name is provided', () => {
      const invalid_bucket_data = {
        'name': 'bad bucket name',
        'apps3buckets': []
      };
      const error = {
        'name': ['Name must have correct env prefix e.g. dev-bucketname']
      };

      mock_api()
        .post('/s3buckets/', JSON.stringify(invalid_bucket_data))
        .reply(400, error);

      return new Bucket(invalid_bucket_data).create()
        .then((_) => { throw new Error('expected failure'); })
        .catch((err) => { assert.deepEqual(err.error, error); });
    });

    it('returns a bucket id after creating the bucket', () => {

      const test_bucket = {
        'name': 'dev-test-bucket',
        'apps3buckets': []
      };

      const expected_id = 1;

      const response = {
        "id": expected_id,
        "url": "http://" + expected_id + "/s3buckets/1/",
        "name": "dev-test-bucket",
        "arn": "arn:aws:s3:::dev-test-bucket",
        "apps3buckets": [],
        "created_by": "github|12345"
      };

      mock_api()
        .post('/s3buckets/', JSON.stringify(test_bucket))
        .reply(201, response);

      return new Bucket(test_bucket).create()
        .then((bucket) => { assert.equal(bucket.id, expected_id); });
    });

  });

});
