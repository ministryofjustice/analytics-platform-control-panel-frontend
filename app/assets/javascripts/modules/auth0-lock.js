'use strict';

moj.Modules.auth0lock = {
  containerId: 'js-login-container',

  init: function() {
    var self = this;

    if($('#' + self.containerId).length) {
      self.showLock();
    }
  },

  showLock: function() {
    var self = this,
        $el = $('#' + self.containerId),
        clientId = $el.data('auth0-clientid'),
        domain = $el.data('auth0-domain'),
        callbackurl = $el.data('auth0-callbackurl'),
        lock;

    lock = new Auth0Lock(clientId, domain);
    lock.show({
      callbackURL: callbackurl,
      responseType: "code",
      authParams: {
        scope: "openid profile offline_access"
      },
      container: self.containerId
    });
  }
};
