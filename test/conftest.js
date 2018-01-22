"use strict";
const cls = require('continuation-local-storage');
const config = require('../app/config');
const { ControlPanelAPIClient } = require('../app/api_clients/control_panel_api');
const { GithubAPIClient } = require('../app/api_clients/github');
const { KubernetesAPIClient } = require('../app/api_clients/kubernetes');
const nock = require('nock');
const { load_routes, url_for } = require('../app/routes');
const { User } = require('../app/models');


const ns = cls.createNamespace(config.continuation_locals.namespace);
exports.ns = ns;

const user = new User({ id_token: 'dummy-token', username: 'test' });
exports.user = user;

exports.withAPI = (fn) => {
  return () => {
    return ns.run(() => {
      ns.set('cpanel', new ControlPanelAPIClient(config.api));
      ns.set('github', new GithubAPIClient(config));
      const kubernetes = new KubernetesAPIClient(config.api);
      kubernetes.authenticate(user);
      ns.set('kubernetes', kubernetes)
      return fn();
    });
  };
};

load_routes();

exports.config = config;
exports.mock_api = () => { return nock(exports.config.api.base_url); };
exports.url_for = url_for;
