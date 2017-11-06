"use strict";

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const nock = require('nock');

const api = require('../app/api-client');
const config = require('../app/config');
const server = require('../app/index');
const views = require('../app/base/views');


describe('Edit app', () => {

  describe('an authenticated user', () => {
    const AUTH_HEADER = /JWT .*/

    it('renders apps/edit.html passing app, buckets and users', () => {
      const APP = require('./fixtures/app')
      const BUCKETS = require('./fixtures/buckets')
      const USERS = require('./fixtures/users')

      // Mock API requests
      let app_details_request = nock(config.api.base_url)
        .get(`/apps/${APP.id}/`)
        .matchHeader('Authorization', AUTH_HEADER)
        .reply(200, APP);
      let buckets_list_request = nock(config.api.base_url)
        .get(`/s3buckets/`)
        .matchHeader('Authorization', AUTH_HEADER)
        .reply(200, BUCKETS);
      let users_list_request = nock(config.api.base_url)
        .get(`/users/`)
        .matchHeader('Authorization', AUTH_HEADER)
        .reply(200, USERS);


      // // CHECKS
      // api.get_app(APP.id).then(
      //   (app) => {
      //     console.log("APP =>", JSON.stringify(app))
      //   }
      // )
      // api.list_buckets().then(
      //   (buckets) => {
      //     console.log("BUCKETS =>", JSON.stringify(buckets))
      //   }
      // )
      // api.list_users().then(
      //   (users) => {
      //     console.log("USERS =>", JSON.stringify(users))
      //   }
      // )

      // Make request to node endpoint
      // SEE: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
      chai
        .request(server)
        .get(`/apps/${APP.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.app.should.be.eql(APP);
          res.body.buckets.should.be.eql(BUCKETS);
          res.body.users.should.be.eql(USERS);
        })
    });

  });

});
