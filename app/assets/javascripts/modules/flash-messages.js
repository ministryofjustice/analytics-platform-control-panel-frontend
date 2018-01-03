moj.Modules.flashMessage = {
  messageClass: 'flash-message',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    $(document).on('click', `.${this.messageClass}`, (e) => {
      $(e.target).fadeOut();
    });
  },
};
