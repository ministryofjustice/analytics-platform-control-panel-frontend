'use strict';

moj.Modules.linkAlert = {
  alertClass: 'js-alert',
  messageDataAttr: 'alert-message',

  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $('.' + self.alertClass).on('click', function(e) {
      var $el = $(e.target);
      e.preventDefault();

      alert($el.data(self.messageDataAttr));
    });
  }
};
