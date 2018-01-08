const { assert } = require('chai');
const { mock_api } = require('./conftest');
const { api } = require('../app/api_clients/kubernetes.js');
const { Deployment, ModelSet, Pod, Tool } = require('../app/models');


describe('Tool model', () => {
  const deployments_response = require('./fixtures/deployments');
  const pods_response = require('./fixtures/deployment-pods');

  describe('list()', () => {
    it('lists current user\'s tools', () => {
      const namespace = 'user-andyhd';

      const get_deployments = mock_api()
        .get(`/k8s/apis/apps/v1beta2/namespaces/${namespace}/deployments`)
        .reply(200, deployments_response);

      const get_pods = mock_api()
        .get(`/k8s/api/v1/namespaces/${namespace}/pods`)
        .reply(200, pods_response);

      api.namespace = namespace;

      Tool.list()
        .then((tools) => {
          const expected_tools = new ModelSet(Deployment, deployments_response.items);
          expected_tools[0].pods = new ModelSet(Pod, pods_response.items);
          assert.deepEqual(tools, expected_tools);

          assert(get_deployments.isDone());
          assert(get_pods.isDone());
        });
    });
  });
});
