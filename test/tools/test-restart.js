"use strict";
const { assert, spy } = require('chai').use(require('chai-spies'));
const { config, dispatch, mock_api, url_for, user } = require('../conftest');
const handlers = require('../../app/tools/handlers');

const deployments = require('../fixtures/deployments');


describe('tools', () => {
  const ns = user.kubernetes_namespace;

  describe('restart', () => {
    it('restarts the specified tool', () => {
      const name = 'test-rstudio-rstudio';

      const get_deployment = mock_api()
        .get(`/k8s/apis/apps/v1beta2/namespaces/${ns}/deployments/${name}`)
        .reply(200, deployments.items[0]);
      const delete_pods = mock_api()
        .delete(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(204, {});

      return dispatch(handlers.restart, { params: { name } })
        .then(({ redirect_url }) => {
          assert(get_deployment.isDone());
          assert(delete_pods.isDone());
          assert.equal('/#Analytical%20tools', redirect_url);
        });
    });
  });

  describe('deploy', () => {
    it('deploy the specified tool for the user', () => {
      const name = 'rstudio';
      const expected_redirect_url = '/#Analytical%20tools';

      const deploy_request = new Promise((resolve) => {
        mock_api()
          .post(`/tools/${name}/deployments/`)
          .reply(201, () => { resolve(true); });
      });

      return Promise.all([
        dispatch(handlers.deploy, { params: { name } }),
        deploy_request
      ])
        .then(([{ redirect_url, req }, deploy_request_done]) => {
          assert.equal(expected_redirect_url, redirect_url);
          assert(req.session.rstudio_is_deploying);
          assert(deploy_request_done);
        });
    });
  });
});
