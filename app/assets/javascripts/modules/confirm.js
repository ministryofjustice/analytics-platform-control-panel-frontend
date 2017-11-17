'use strict';

moj.Modules.jsConfirm = {
  confirmClass: 'js-confirm',
  defaultConfirmMessage: 'Are you sure?',

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'a.' + self.confirmClass, function(e) {
      var $el = $(e.target);
      e.preventDefault();

      if (confirm(self.getConfirmMessage($el))) {
        window.document.location = $el.attr('href');
      }
    });

    $(document).on('click', 'input[type="submit"].' + self.confirmClass, function(e) {
      var $el = $(e.target);
      e.preventDefault();

      if (confirm(self.getConfirmMessage($el))) {
        $el.closest('form').submit();
      }
    });
  },

  getConfirmMessage: function($el) {
    return $el.data('confirm-message') || this.defaultConfirmMessage;
  }
};
