moj.Modules.userTypeahead = {
  userSelectName: 'user_id',
  userTypeaheadName: 'user_typeahead',

  init() {
    this.$select = $(`#${this.userSelectName}`);

    if (this.$select.length) {
      this.$form = this.$select.closest('form');
      this.$userTypeahead = this.$form.find(`#${this.userTypeaheadName}`);
      this.initTypeahead();
      this.bindEvents();
    }
  },

  bindEvents() {
    this.$userTypeahead.on('keyup', () => {
      this.updateSelect();
    });
  },

  initTypeahead() {
    const userOptions = Array.from(this.$select.find('option:gt(0)'));
    this.users = userOptions.map(opt => opt.text);

    this.$select.hide();

    this.$userTypeahead.typeahead({
      order: 'asc',
      maxItem: 0,
      source: {
        data: this.users,
      },
      callback: {
        onClickAfter: () => {
          this.updateSelect();
        },
        onCancel: () => {
          this.resetSelect();
        },
      },
    });
  },

  updateSelect() {
    const userText = this.$userTypeahead.val();
    const userIndex = this.users.indexOf(userText);

    if (userIndex > 0) {
      this.selectOption(userIndex + 1);
    } else {
      this.resetSelect();
    }
  },

  resetSelect() {
    this.selectOption(0);
  },

  selectOption(index) {
    this.$select.find('option').attr('selected', null);
    this.$select.find(`option:eq(${index})`).attr('selected', 'selected');
  },
};
