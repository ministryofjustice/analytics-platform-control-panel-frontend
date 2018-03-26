moj.Modules.accessPanels = {
  buttonClass: 'js-change-access-level',

  init() {
    if ($(`.${this.buttonClass}`).length) {
      this.bindEvents();
    }
  },

  bindEvents() {
    $(`.${this.buttonClass}`).on('click', (e) => {
      this.togglePanel($(e.target).siblings('.panel'));
    });
    $('.js-close-panel').on('click', (e) => {
      this.togglePanel($(e.target).closest('.panel'));
    });
  },

  togglePanel($panel) {
    $panel.toggleClass('js-hidden');
    $panel.siblings('.js-change-access-level').toggle();
  },
};
