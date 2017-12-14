'use strict';

moj.Modules.tabs = {
  listSelector: 'ul.tabs',
  panelSelector: 'section.tab-panel',
  activeClass: 'active',

  init: function() {
    var self = this;

    self.$list = $(self.listSelector);

    if(self.$list.length) {
      self.$tabs = self.$list.find('li');
      self.$panels = $(self.panelSelector);

      self.storeSlugs();
      self.showInitialTab();
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this;

    self.$list.on('click', function(e) {
      self.selectTab($(e.target));
    });
  },

  showInitialTab: function() {
    var self = this;
    var docHash = document.location.hash;
    var tabIndex = 0;

    if(docHash.length) {
      var checkSlug = docHash.slice(1);
      var slugIndex = self.slugs.indexOf(checkSlug);

      if (slugIndex > 0) {
        tabIndex = slugIndex;
      }
    }

    self.showTab(tabIndex);
  },

  storeSlugs: function() {
    var self = this;

    self.slugs = [];
    self.$tabs.each(function(x, tab) {
      var tabSlug = encodeURIComponent($(tab).text());

      self.slugs.push(tabSlug);
    });
  },

  selectTab: function($tab) {
    var self = this;
    var index = self.$tabs.index($tab);

    self.showTab(index);
  },

  showTab: function(index) {
    var self = this;

    self.$tabs.removeClass(self.activeClass);
    self.$panels.removeClass(self.activeClass);
    self.$tabs.eq(index).addClass(self.activeClass);
    self.$panels.eq(index).addClass(self.activeClass);

    document.location.hash = self.slugs[index];
  }
};
