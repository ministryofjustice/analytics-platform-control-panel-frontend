"use strict";
const { assert } = require('chai');
const { config, mock_api, url_for } = require('./conftest');
const { api } = require('../app/k8s-api-client');
const handlers = require('../app/tools/handlers');
const { ModelSet } = require('../app/base-model');
const { Deployment, Pod } = require('../app/models');


describe('tools handler', () => {
  const deployments_response = require('./fixtures/deployments');
  const pods_response = require('./fixtures/deployment-pods');

  describe('list', () => {

    it('lists current user\'s tools', () => {
      const namespace = 'user-andyhd';
      const expected = {
        tools: new ModelSet(Deployment, deployments_response.items),
      };
      expected.tools[0].pods = new ModelSet(Pod, pods_response.items);

      const get_deployments = mock_api()
        .get(`/k8s/apis/apps/v1beta2/namespaces/${namespace}/deployments`)
        .reply(200, deployments_response);

      const get_pods = mock_api()
        .get(`/k8s/api/v1/namespaces/${namespace}/pods`)
        .reply(200, pods_response);

      api.namespace = namespace;

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
          assert(get_deployments.isDone());
          assert(get_pods.isDone());
          assert.deepEqual(data.tools, expected.tools);
          assert.typeOf(data.get_tool_url, 'function');
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

  describe('deploy', () => {

    it('deploy the specified tool for the user', function() {
      this.timeout(2200);
      const tool_name = 'rstudio';

      const post_deployment = mock_api()
        .post(`/tools/${tool_name}/deployments/`)
        .reply(201, {});

      const request = new Promise((resolve, reject) => {
        const req = {
          params: { name: tool_name },
          session: { flash_messages: [] },
        };
        const res = {};
        res.redirect = resolve;
        res.render = reject;
        handlers.deploy(req, res, reject);
      });

      return request
        .then((redirect_url) => {
          const expected_redirect_url = url_for('tools.list');

          assert.equal(redirect_url, expected_redirect_url);
          assert(post_deployment.isDone());
        });
    });
  });
});
