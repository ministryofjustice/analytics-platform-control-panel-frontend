"use strict";
const { assert } = require('chai');
const { config, mock_api } = require('../conftest');

const { KubernetesAPIClient } = require('../../app/api_clients/kubernetes');
const { Repo, ModelSet } = require('../../app/models');


describe('Kubernetes API Client', () => {
  const client = new KubernetesAPIClient(config.api);

  it('runs in the specified namespace', () => {
    const ns = 'test-namespace';

    const request = mock_api()
      .get(`/k8s/api/v1/namespaces/${ns}/pods`)
      .reply(200);

    return client.in_namespace(ns).get('pods')
      .then((pods) => {
        assert(request.isDone());
      });
  });
});
