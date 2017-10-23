'use strict';

moj.Modules.bucketName = {
  inputName: 'new-datasource-name',

  init: function() {
    var self = this;

    if ($('#' + self.inputName).length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
      $input = $('#' + self.inputName),
      prefix = $input.data('prefix');

    $input.on('keypress blur', function() {
      self.checkValue($input, prefix);
    });
  },

  checkValue: function($input, prefix) {
    var val = $input.val();

    if (val.length < prefix.length) {
      val = prefix;
    }

    val = val.toLowerCase().replace(/ /gi, '-');

    $input.val(val);
  }
};
