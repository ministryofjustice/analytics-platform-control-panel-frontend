moj.Modules.newTabs = {
  init() {
    this.$newWindowLinks = $('a[target="_blank"]');

    if (this.$newWindowLinks.length) {
      this.addNewWindowTitleText();
    }
  },

  addNewWindowTitleText() {
    this.$newWindowLinks.each((n, link) => {
      let titleText = $(link).attr('title') || '';
      if (titleText.length) {
        titleText += ' ';
      }
      titleText += '(opens in a new tab/window)';
      $(link).attr('title', titleText);
    });
  },
};
