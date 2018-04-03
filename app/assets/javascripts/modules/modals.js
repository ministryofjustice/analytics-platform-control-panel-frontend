moj.Modules.modals = {
  triggerClass: 'js-modal-trigger',
  contentClass: 'js-modal-content',

  init() {
    if ($(`.${this.triggerClass}`).length) {
      this.bindEvents();
    }
  },

  bindEvents() {
    $(`.${this.triggerClass}`).on('click', (event) => {
      this.triggerModal($(event.target));
    });
    $(document).on($.modal.AFTER_CLOSE, () => {
      $('.modal').remove();
    });
  },

  triggerModal($trigger) {
    const content_handle = $trigger.data('content');
    const content = $(`#content-${content_handle}`).html();
    $('body').append(`<div class="modal" id="modal-${content_handle}">${content}</div>`);
    $(`#modal-${content_handle}`).modal();
  },
};
