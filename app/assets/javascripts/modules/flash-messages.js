moj.Modules.flashMessage = {
  messageClass: 'flash-message',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const self = this;

    $(document).on('click', `.${self.messageClass}`, (e) => {
      $(e.target).fadeOut();
    });
  },
};
