const { assert } = require('chai');
const { mock_api, url_for } = require('./conftest');
const { api } = require('../app/k8s-api-client');
const handlers = require('../app/tools/handlers');


describe('tools handler', () => {

  describe('restart', () => {
    const deployments_response = require('./fixtures/deployments');

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
          const expected_redirect_url = url_for('base.home', { fragment: 'Analytical tools' });

          assert.equal(redirect_url, expected_redirect_url);
          assert(post_deployment.isDone());
        });
    });
  });
});
