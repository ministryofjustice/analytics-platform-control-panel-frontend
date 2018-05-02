moj.Modules.whatsNewNotification = {
  cookieName: 'whats-new-hash',
  metaTagName: 'whats-new-hash',
  whatsNewElementId: 'whats-new-container',
  notificationClass: 'whats-new-notification',
  notificationHTML: '<a href="/whats-new"><span>What\'s new</span>?</a>',

  init() {
    const hash = moj.Modules.cookies.read(this.cookieName);
    if (this.checkHash(hash)) {
      this.showNotification();
    }

    if ($(`#${this.whatsNewElementId}`).length) {
      this.updateCookie();
      this.removeNotification();
    }

    $('#wipeCookie').on('click', (e) => {
      e.preventDefault();
      moj.Modules.cookies.erase(this.cookieName);
    });
  },

  checkHash(hash) {
    this.storedHash = $(`meta[name="${this.metaTagName}"]`).attr('content');

    return !(this.storedHash && escape(this.storedHash) === escape(hash));
  },

  showNotification() {
    $(`.${this.notificationClass}`).show();
  },

  removeNotification() {
    $(`.${this.notificationClass}`).fadeOut();
  },

  updateCookie() {
    moj.Modules.cookies.store(this.cookieName, this.storedHash, 90);
  },
};
