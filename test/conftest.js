const cls = require('cls-hooked');
const config = require('../app/config');
const { ControlPanelAPIClient } = require('../app/api_clients/control_panel_api');
const { GithubAPIClient } = require('../app/api_clients/github');
const { KubernetesAPIClient } = require('../app/api_clients/kubernetes');
const nock = require('nock');
const { load_routes, url_for } = require('../app/routes');
const { User } = require('../app/models');

// Setting dummy variable to allow tests to pass
config.aws = {
  login_url: 'qwertyuiop'
};

exports.ns = cls.createNamespace(config.continuation_locals.namespace);

const default_user = new User({ id_token: 'dummy-token', username: 'test' });
exports.user = default_user;

function init_api_clients(ns) {
  ns.set('cpanel', new ControlPanelAPIClient(config.api));
  ns.set('github', new GithubAPIClient(config));
  const kubernetes = new KubernetesAPIClient(config.api);
  kubernetes.authenticate(default_user);
  ns.set('kubernetes', kubernetes);
}


exports.withAPI = fn => () => exports.ns.run(() => {
  init_api_clients(exports.ns);
  return fn();
});


function default_session() {
  return {
    flash_messages: [],
  };
}


function dispatch(
  handler,
  {
    params = undefined,
    body = undefined,
    session = default_session(),
    user = default_user,
  } = {},
) {
  const request = new Promise((resolve, reject) => {
    const req = {
      params,
      body,
      session,
      user,
    };
    const res = {
      redirect: (redirect_url) => { resolve({ redirect_url, req }); },
      render: (template, context) => { resolve({ template, context, req }); },
    };
    const next = (error) => {
      if (error) {
        reject(error);
      }
      resolve({ req });
    };

    return exports.ns.run(() => {
      init_api_clients(exports.ns);
      return handler(req, res, next);
    });
  });
  return request;
}

exports.dispatch = dispatch;

load_routes();

exports.config = config;
exports.mock_api = () => nock(exports.config.api.base_url);
exports.url_for = url_for;
