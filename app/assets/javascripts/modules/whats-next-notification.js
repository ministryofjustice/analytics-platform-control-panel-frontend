moj.Modules.whatsNextNotification = {
  cookieName: 'whats-next-hash',
  metaTagName: 'whats-new-hash',
  whatsNewElementId: 'whats-new-container',
  notificationClass: 'whats-new-notification',
  notificationHTML: '<a href="/whats-new"><span>What\'s new</span>?</a>',

  init() {
    const cookieValue = moj.Modules.cookies.read(this.cookieName);
    if (this.checkCookie(cookieValue)) {
      this.showNotification();
    }

    if ($(`#${this.whatsNewElementId}`).length) {
      this.updateCookie();
      this.removeNotification();
    }

    $('#wipeCookie').on('click', () => {
      moj.Modules.cookies.erase(this.cookieName);
      document.location.href = '/';
    });
  },

  checkCookie(cookieValue) {
    this.storedHash = $(`meta[name="${this.metaTagName}"]`).attr('content');

    if (this.storedHash && this.storedHash === cookieValue) {
      return false;
    }
    return true;
  },

  showNotification() {
    $('#proposition-menu').append(`<span class="${this.notificationClass}">${this.notificationHTML}</span>`);
  },

  removeNotification() {
    $(`.${this.notificationClass}`).fadeOut();
  },

  updateCookie() {
    moj.Modules.cookies.store(this.cookieName, this.storedHash, 90);
  },
};
