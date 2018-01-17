moj.Modules.auth0lock = {
  containerId: 'js-login-container',
  config: {
    allowedConnections: ['github'],
    auth: {
      connectionScopes: {
        github: ['read:org', 'read:user', 'repo'],
      },
      params: {
        scope: 'openid email profile offline_access',
      },
      responseType: 'code',
    },
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
  },

  init() {
    if ($(`#${this.containerId}`).length) {
      this.showLock();
    }
  },

  showLock() {
    const lockConfig = this.config;
    const $el = $(`#${this.containerId}`);
    const clientId = $el.data('auth0-clientid');
    const domain = $el.data('auth0-domain');
    lockConfig.container = this.containerId;
    lockConfig.auth.redirectUrl = $el.data('auth0-callbackurl');
    lockConfig.auth.state = $el.data('auth0-state');
    const lock = new Auth0Lock(clientId, domain, lockConfig);

    lock.show();
  },
};
