const { assert } = require('chai');
const { mock_api } = require('./conftest');
const { api } = require('../app/api_clients/kubernetes');
const { Deployment, ModelSet, Pod } = require('../app/models');
const deployments = require('./fixtures/deployments').items;
const pods_response = require('./fixtures/deployment-pods');


describe('K8sModel', () => {
  describe('Deployment', () => {
    it('has a number of pods', () => {
      const ns = 'user-test';
      const expected = new ModelSet(Pod, pods_response.items);
      const rstudio = new Deployment(deployments[0]);

      const pods_request = mock_api()
        .get(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(200, pods_response);

      api.namespace = ns;

      rstudio.get_pods()
        .then((pods) => {
          assert(pods_request.isDone());
          assert.deepEqual(pods, expected);
        });
    });

    it('restarts by deleting all pods', () => {
      const ns = 'user-test';
      const rstudio = new Deployment(deployments[0]);

      const delete_pods = mock_api()
        .delete(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(200, {
          'apiVersion': 'v1',
          'kind': 'Status',
          'status': 'Success'
        });

      api.namespace = ns;

      rstudio.restart()
        .then(() => {
          assert(delete_pods.isDone());
        });
    });
  });
});
