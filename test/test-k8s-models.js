const { assert } = require('chai');
const { mock_api } = require('./conftest');
const { api } = require('../app/k8s-api-client');
const { ModelSet } = require('../app/base-model');
const { Pod, Deployment } = require('../app/models');


describe('K8sModel', () => {
  describe('Deployment', () => {
    it('has a number of pods', () => {
      const ns = 'user-test';
      const deployments_response = require('./fixtures/apps');
      const pods_response = require('./fixtures/deployment-pods');
      const expected = new ModelSet(Pod, pods_response.items);

      const pods_request = mock_api()
        .get(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(200, pods_response);

      const rstudio = new Deployment(require('./fixtures/deployments').items[0]);

      api.namespace = ns;

      rstudio.get_pods()
        .then((pods) => {
          assert(pods_request.isDone());
          assert.deepEqual(pods, expected);
        });
    });

    it('restarts by deleting all pods', () => {
      const ns = 'user-test';
      const rstudio = new Deployment(require('./fixtures/deployments').items[0]);
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
