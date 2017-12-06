const { assert } = require('chai');
const { config, mock_api } = require('./conftest');
const { api } = require('../app/k8s-api-client');
const { ModelSet } = require('../app/base-model');
const { Deployment } = require('../app/models');


describe('KubernetesAPIClient', () => {

  it('builds a URL based on endpoint name', () => {
    const namespace = 'user-andyhd';
    const deployments_response = require('./fixtures/deployments');
    const url = `/k8s/apis/apps/v1beta2/namespaces/${namespace}/deployments`;
    const expected = new ModelSet(Deployment, deployments_response.items);

    const request = mock_api()
      .get(url)
      .reply(200, deployments_response);

    api.namespace = namespace;

    return Deployment.list()
      .then((tools) => {
        assert(request.isDone(), 'deployments API not called');
        assert.deepEqual(tools, expected);
      });
  });
});

