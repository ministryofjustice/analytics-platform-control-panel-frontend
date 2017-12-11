'use strict';

moj.Modules.flashMessage = {
  messageClass: 'flash-message',

  init: function() {
    this.bindEvents()
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', '.' + self.messageClass, function(e) {
      $(e.target).fadeOut();
    });
  }
};
