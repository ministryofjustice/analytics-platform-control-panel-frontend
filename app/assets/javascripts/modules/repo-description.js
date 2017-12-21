'use strict';

moj.Modules.repoDescription = {
  repoPrefix: 'https://github.com',
  apiUrlPrefix: 'https://api.github.com/repos',
  orgSelectName: 'repo_org',
  repoSlugSelectName: 'name',
  repoUrlHiddenInputName: 'repo_url',
  descriptionInputName: 'description',

  init: function() {
    var self = this;
    self.$repoSlugSelect = $('#' + self.repoSlugSelectName);
    self.$orgSelect = $('#' + self.orgSelectName);
    self.$repoUrlHiddenInput = $('#' + self.repoUrlHiddenInputName);

    if (self.$repoSlugSelect.length) {
      self.bindEvents();
      self.showOrgRepos();
    }
  },

  bindEvents: function() {
    var self = this;

    self.$repoSlugSelect.on('change', function() {
      if(self.$repoSlugSelect.val()) {
        self.getRepoDescription();
      } else {
        self.updateDescription('');
        $('#repo-results').addClass('js-hidden');
      }
    });
    self.$orgSelect.on('change', function() {
      self.showOrgRepos();
    });
  },

  showOrgRepos: function() {
    var self = this;
    var currentOrg = self.$orgSelect.val();

    $('optgroup.org-repos').hide();
    $('optgroup[label="' + currentOrg + '"]').show();
    self.$repoSlugSelect.find('option').eq(0).prop('selected', true);
    self.updateDescription('');
    $('#repo-results').addClass('js-hidden');
  },

  getRepoDescription: function() {
    var self = this;
    var repoUrl = self.concatUrl(self.repoPrefix);
    var description = self.$repoSlugSelect.find('option:selected').data('description');

    self.updateDescription(description);
    self.$repoUrlHiddenInput.val(repoUrl);
    $('#repo-results').removeClass('js-hidden');
  },

  concatUrl: function(prefix) {
    var self = this;
    var org = self.$orgSelect.val();
    var slug = self.$repoSlugSelect.val();

    return [prefix, org, slug].join('/');
  },

  updateDescription: function(description) {
    var self = this;

    if(description) {
      $('#' + self.descriptionInputName).val(description);
      $('#repo-' + self.descriptionInputName).text(description);
    } else {
      $('#repo-' + self.descriptionInputName).text('None provided');
      $('#' + self.descriptionInputName).val('');
    }
  }
};
