moj.Modules.toolsStatusPolling = {
  toolsPath: '/tools',
  toolsSlug: 'Analytical%20tools',
  pollingFrequency: 10 * 1000,
  pollingTimer: null,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    moj.Events.on('tab-selected', (event, params) => {
      if (params.slug === this.toolsSlug) {
        this.enablePolling(params.panel);
      } else {
        this.disablePolling();
      }
    });
  },

  enablePolling(panel) {
    this.pollingTimer = setInterval(() => {
      this.update(panel);
    }, this.pollingFrequency);
  },

  disablePolling() {
    clearInterval(this.pollingTimer);
  },

  update(panel) {
    $.ajax({
      url: this.toolsPath,
      dataType: 'html',
    }).done((newContent) => {
      panel.html(newContent);
    });
  },

};
