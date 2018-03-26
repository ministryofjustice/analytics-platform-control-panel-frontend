moj.Modules.userTypeahead = {
  userSelectName: 'user_id',
  userTypeaheadName: 'user_typeahead',

  init() {
    this.$select = $(`#${this.userSelectName}`);

    if (this.$select.length) {
      this.$form = this.$select.closest('form');
      this.$formSubmit = this.$form.find('input[type="submit"]');
      this.$userTypeahead = this.$form.find(`#${this.userTypeaheadName}`);
      this.$accessLevelPanel = $('#data-access-level-panel');
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
    this.setFormDisabled(true);

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
      this.setFormDisabled(false);
    } else {
      this.resetSelect();
    }
  },

  resetSelect() {
    this.selectOption(0);
    this.setFormDisabled(true);
  },

  selectOption(index) {
    this.$select.find('option').attr('selected', null);
    this.$select.find(`option:eq(${index})`).attr('selected', 'selected');
  },

  setFormDisabled(state) {
    this.$formSubmit.prop('disabled', state);
    if (state) {
      this.$accessLevelPanel.addClass('js-hidden').find('input[type="radio"]:eq(0)').prop('checked', 'checked');
    } else {
      this.$accessLevelPanel.removeClass('js-hidden');
    }
  },
};
