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
    const lockOptions = {
      allowedConnections: ['github'],
      auth: {
        connectionScopes: {
          github: ['read:org', 'read:user', 'repo'],
        },
        params: {
          scope: 'openid profile offline_access',
        },
        responseType: 'code',
        redirectUrl: callbackurl,
      },
      container: this.containerId,
      theme: {
        logo: '/static/images/gov.uk_logotype_crown.svg',
        primaryColor: '#000000',
        authButtons: {
          github: {
            primaryColor: '#efefef',
            foregroundColor: '#000000',
          },
        },
      },
      languageDictionary: {
        title: 'Log in',
      },
      rememberLastLogin: true,
    };
    const lock = new Auth0Lock(clientId, domain, lockOptions);

    lock.show();
  },
};
