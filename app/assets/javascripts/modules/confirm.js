'use strict';

moj.Modules.jsConfirm = {
  confirmClass: 'js-confirm',
  confirmMessage: 'Are you sure?',

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $('a.' + self.confirmClass).on('click', function(e) {
      e.preventDefault();

      if (confirm(self.confirmMessage)) {
        window.document.location = $(e.target).attr('href');
      }
    });

    $('input[type="submit"].' + self.confirmClass).on('click', function(e) {
      e.preventDefault();

      if (confirm(self.confirmMessage)) {
        $(e.target).closest('form').submit();
      }
    });
  }
};
