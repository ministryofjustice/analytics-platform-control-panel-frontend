moj.Modules.tabs = {
  listSelector: 'ul.tabs',
  panelSelector: 'section.tab-panel',
  activeClass: 'active',

  init() {
    this.$list = $(this.listSelector);

    if (this.$list.length) {
      this.$tabs = this.$list.find('li');
      this.$panels = $(this.panelSelector);

      this.storeSlugs();
      this.showInitialTab();
      this.bindEvents();
    }
  },

  bindEvents() {
    this.$list.on('click', (e) => {
      this.selectTab($(e.target));
    });
  },

  showInitialTab() {
    const docHash = document.location.hash;
    let tabIndex = 0;

    if (docHash.length) {
      const checkSlug = docHash.slice(1);
      const slugIndex = this.slugs.indexOf(checkSlug);

      if (slugIndex > 0) {
        tabIndex = slugIndex;
      }
    }

    this.showTab(tabIndex);
  },

  storeSlugs() {
    this.slugs = [];
    this.$tabs.each((x, tab) => {
      const tabSlug = encodeURIComponent($(tab).text());

      this.slugs.push(tabSlug);
    });
  },

  selectTab($tab) {
    const index = this.$tabs.index($tab);

    this.showTab(index);
  },

  showTab(index) {
    this.$tabs.removeClass(this.activeClass);
    this.$panels.removeClass(this.activeClass);
    this.$tabs.eq(index).addClass(this.activeClass);
    this.$panels.eq(index).addClass(this.activeClass);

    document.location.hash = this.slugs[index];

    this.triggerTabSelected(index);
  },

  triggerTabSelected(index) {
    moj.Events.trigger('tab-selected', {
      index,
      slug: this.slugs[index],
    });
  },

};
