'use strict';

moj.Modules.bucketName = {
  inputName: 'new-datasource-name',

  init: function() {
    var self = this;
    self.$input = $('#' + self.inputName);

    if (self.$input.length) {
      self.prefix = self.$input.data('bucket-prefix');
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this;

    self.$input.on('keypress blur', function() {
      self.formatBucketName();
    });
  },

  formatBucketName: function() {
    var self = this,
      val = self.$input.val();

    if (val.length < self.prefix.length) {
      val = self.prefix;
    }

    val = val.toLowerCase().replace(/ /gi, '-');
    self.$input.val(val);
  }
};
