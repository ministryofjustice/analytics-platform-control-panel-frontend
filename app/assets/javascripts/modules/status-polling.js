moj.Modules.toolsStatusPolling = {
  toolsSlug: 'Analytical%20tools',
  pollingFrequency: 10 * 1000,
  pollingTimer: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    moj.Events.on('tab-selected', (event, params) => {
      if (params.slug === this.toolsSlug) {
        this.enablePolling();
      } else {
        this.disablePolling();
      }
    });
  },

  enablePolling() {
    this.pollingTimer = setInterval(() => {
      document.location.reload(true);
    }, this.pollingFrequency);
  },

  disablePolling() {
    clearTimeout(this.pollingTimer);
  },

};
