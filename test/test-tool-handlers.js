"use strict";
const { assert } = require('chai');
const { config, mock_api, url_for } = require('./conftest');
const { api } = require('../app/k8s-api-client');
const handlers = require('../app/tools/handlers');
const { ModelSet } = require('../app/base-model');
const { Deployment } = require('../app/models');


describe('tools handler', () => {
  const deployments_response = require('./fixtures/deployments');


  describe('list', () => {

    it('lists current user\'s tools', () => {
      const namespace = 'user-andyhd';
      api.namespace = namespace;
      const url = `/k8s/apis/apps/v1beta2/namespaces/${namespace}/deployments`;
      const expected = {
        tools: new ModelSet(Deployment, deployments_response.items),
      };

      const api_request = mock_api()
        .get(url)
        .reply(200, deployments_response);

      const request = new Promise((resolve, reject) => {
        let req = {};
        let res = {};
        res.render = (template, data) => {
          resolve({ template, data });
        };
        handlers.list(req, res, reject);
      });

      return request
        .then(({ template, data }) => {
          assert(api_request.isDone());
          assert.deepEqual(data, expected);
        });
    });

  });

  describe('restart', () => {

    it('restarts the specified tool', () => {
      const namespace = 'user-andyhd';
      api.namespace = namespace;
      const tool = deployments_response.items[0];
      const url = `/k8s/api/v1/namespaces/${namespace}/pods?labelSelector=app%3Drstudio`;

      const get_deployment = mock_api()
        .get(`/k8s/apis/apps/v1beta2/namespaces/${namespace}/deployments/${tool.metadata.name}`)
        .reply(200, tool);
      const delete_pods = mock_api()
        .delete(url)
        .reply(204, {});

      const request = new Promise((resolve, reject) => {
        let req = {
          params: { name: tool.metadata.name },
          session: { flash_messages: [] },
        };
        let res = {};
        res.redirect = resolve;
        res.render = reject;
        handlers.restart(req, res, reject);
      });

      return request
        .then((redirect_url) => {
          assert(get_deployment.isDone());
          assert(delete_pods.isDone());
        });
    });

  });

});
