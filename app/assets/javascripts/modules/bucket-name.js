moj.Modules.bucketName = {
  inputName: 'new-datasource-name',

  init() {
    const self = this;

    self.$input = $(`#${self.inputName}`);

    if (self.$input.length) {
      self.prefix = self.$input.data('bucket-prefix');
      self.bindEvents();
    }
  },

  bindEvents() {
    const self = this;

    self.$input.on('keypress blur', () => {
      self.formatBucketName();
    });
  },

  formatBucketName() {
    const self = this;
    let val = self.$input.val();

    if (val.length < self.prefix.length) {
      val = self.prefix;
    }

    val = val.toLowerCase().replace(/ /gi, '-');
    self.$input.val(val);
  },
};
