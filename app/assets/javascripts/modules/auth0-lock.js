moj.Modules.auth0lock = {
  containerId: 'js-login-container',

  init() {
    const self = this;

    if ($(`#${self.containerId}`).length) {
      self.showLock();
    }
  },

  showLock() {
    const self = this;
    const $el = $(`#${self.containerId}`);
    const clientId = $el.data('auth0-clientid');
    const domain = $el.data('auth0-domain');
    const callbackurl = $el.data('auth0-callbackurl');
    const lock = new Auth0Lock(clientId, domain);

    lock.show({
      callbackURL: callbackurl,
      responseType: 'code',
      authParams: {
        connection_scopes: {
          github: ['read:org', 'read:user', 'repo'],
        },
        scope: 'openid profile offline_access',
      },
      container: self.containerId,
    });
  },
};
