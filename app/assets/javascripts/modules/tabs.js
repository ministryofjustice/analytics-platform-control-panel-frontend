moj.Modules.tabs = {
  listSelector: 'ul.tabs',
  panelSelector: 'section.tab-panel',
  activeClass: 'active',

  init() {
    const self = this;

    self.$list = $(self.listSelector);

    if (self.$list.length) {
      self.$tabs = self.$list.find('li');
      self.$panels = $(self.panelSelector);

      self.storeSlugs();
      self.showInitialTab();
      self.bindEvents();
    }
  },

  bindEvents() {
    const self = this;

    self.$list.on('click', (e) => {
      self.selectTab($(e.target));
    });
  },

  showInitialTab() {
    const self = this;
    const docHash = document.location.hash;
    let tabIndex = 0;

    if (docHash.length) {
      const checkSlug = docHash.slice(1);
      const slugIndex = self.slugs.indexOf(checkSlug);

      if (slugIndex > 0) {
        tabIndex = slugIndex;
      }
    }

    self.showTab(tabIndex);
  },

  storeSlugs() {
    const self = this;

    self.slugs = [];
    self.$tabs.each((x, tab) => {
      const tabSlug = encodeURIComponent($(tab).text());

      self.slugs.push(tabSlug);
    });
  },

  selectTab($tab) {
    const self = this;
    const index = self.$tabs.index($tab);

    self.showTab(index);
  },

  showTab(index) {
    const self = this;

    self.$tabs.removeClass(self.activeClass);
    self.$panels.removeClass(self.activeClass);
    self.$tabs.eq(index).addClass(self.activeClass);
    self.$panels.eq(index).addClass(self.activeClass);

    document.location.hash = self.slugs[index];
  },
};
