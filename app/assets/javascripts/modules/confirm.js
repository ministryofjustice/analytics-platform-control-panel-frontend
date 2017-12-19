moj.Modules.jsConfirm = {
  confirmClass: 'js-confirm',
  defaultConfirmMessage: 'Are you sure?',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const self = this;

    $(document).on('click', `a.${self.confirmClass}`, (e) => {
      const $el = $(e.target);
      e.preventDefault();

      if (window.confirm(self.getConfirmMessage($el))) {
        window.document.location = $el.attr('href');
      }
    });

    $(document).on('click', `input[type="submit"].${self.confirmClass}`, (e) => {
      const $el = $(e.target);
      e.preventDefault();

      if (window.confirm(self.getConfirmMessage($el))) {
        $el.closest('form').submit();
      }
    });
  },

  getConfirmMessage($el) {
    return $el.data('confirm-message') || this.defaultConfirmMessage;
  },
};
