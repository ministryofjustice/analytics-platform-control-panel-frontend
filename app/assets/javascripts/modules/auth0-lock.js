moj.Modules.auth0lock = {
  containerId: 'js-login-container',

  init() {
    if ($(`#${this.containerId}`).length) {
      this.showLock();
    }
  },

  showLock() {
    const $el = $(`#${this.containerId}`);
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
      container: this.containerId,
    });
  },
};
