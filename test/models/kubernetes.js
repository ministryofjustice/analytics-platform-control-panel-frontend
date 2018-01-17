"use strict";
const { assert } = require('chai');
const { mock_api } = require('../conftest');
const kubernetes = require('../../app/api_clients/kubernetes');
const { Deployment, DoesNotExist, ModelSet, Pod, User } = require('../../app/models');
const deployments_response = require('../fixtures/deployments');
const pods_response = require('../fixtures/deployment-pods');


describe('Kubernetes Model', () => {
  const user = new User({ id_token: 'dummy-token', username: 'test' });
  const ns = user.kubernetes_namespace;
  kubernetes.api.authenticate(user);

  it('lists all instances', () => {
    mock_api()
      .get(`/k8s/api/v1/namespaces/${ns}/pods`)
      .reply(200, pods_response);

    return Pod.list()
      .then((pods) => {
        assert.equal(pods.length, pods_response.items.length);
        assert.instanceOf(pods[0], Pod);
      });
  });

  it('Retrieves an instance by name', () => {
    const name = 'andyhd-rstudio-rstudio-4159917267-vlb52';

    mock_api()
      .get(`/k8s/api/v1/namespaces/${ns}/pods/${name}`)
      .reply(200, pods_response.items[0]);

    return Pod.get(name)
      .then((pod) => {
        assert.equal(pod.metadata.name, name);
      });
  });

  it('throws an exception if no instance found', () => {
    mock_api()
      .get(`/k8s/api/v1/namespaces/${ns}/pods/non-existent`)
      .reply(404, 'Not Found');

    return Pod.get('non-existent')
      .then((pod) => {
        assert.fail('Expected failure');
      })
      .catch((error) => {
        assert.instanceOf(error, DoesNotExist);
      });
  });

  it('Deletes all instances', () => {
    const delete_request = mock_api()
      .delete(`/k8s/api/v1/namespaces/${ns}/pods`)
      .reply(200, {});

    return Pod.delete_all()
      .then(() => {
        assert(delete_request.isDone());
      });
  });

  describe('Deployment', () => {
    it('has a number of pods', () => {
      const expected = new ModelSet(Pod, pods_response.items);
      const rstudio = new Deployment(deployments_response.items[0]);

      const pods_request = mock_api()
        .get(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(200, pods_response);

      rstudio.get_pods()
        .then((pods) => {
          assert(pods_request.isDone());
          assert.deepEqual(pods, expected);
        });
    });

    it('restarts by deleting all pods', () => {
      const rstudio = new Deployment(deployments_response.items[0]);

      const delete_pods = mock_api()
        .delete(`/k8s/api/v1/namespaces/${ns}/pods?labelSelector=app%3Drstudio`)
        .reply(200, {
          'apiVersion': 'v1',
          'kind': 'Status',
          'status': 'Success'
        });

      rstudio.restart()
        .then(() => {
          assert(delete_pods.isDone());
        });
    });

    it('lists tools with associated pods', () => {
      const get_deployments = mock_api()
        .get(`/k8s/apis/apps/v1beta2/namespaces/${ns}/deployments`)
        .reply(200, deployments_response);

      const get_pods = mock_api()
        .get(`/k8s/api/v1/namespaces/${ns}/pods`)
        .reply(200, pods_response);

      Deployment.list()
        .then((tools) => {
          assert(get_deployments.isDone());
          assert(get_pods.isDone());
          assert.equal(tools.length, deployments_response.items.length);
          assert.isAtLeast(tools[0].pods.length, 1);
        });
    });
  });
});
