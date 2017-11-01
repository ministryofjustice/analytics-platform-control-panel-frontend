'use strict';

moj.Modules.jsConfirm = {
  confirmClass: 'js-confirm',

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $('.' + self.confirmClass).on('click', function(e) {
      e.preventDefault();

      if (confirm('Are you sure?')) {
        window.document.location = $(e.target).attr('href');
      }
    });
  }
};
