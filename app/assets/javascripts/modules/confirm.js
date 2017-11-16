'use strict';

moj.Modules.jsConfirm = {
  confirmClass: 'js-confirm',
<<<<<<< HEAD
  defaultConfirmMessage: 'Are you sure?',
=======
  confirmMessage: 'Are you sure?',
>>>>>>> f0a8f70... delete app endpoint and wired up buttons

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $('a.' + self.confirmClass).on('click', function(e) {
      var $el = $(e.target);
      e.preventDefault();

      if (confirm(self.getConfirmMessage($el))) {
        window.document.location = $el.attr('href');
      }
    });

    $('input[type="submit"].' + self.confirmClass).on('click', function(e) {
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
