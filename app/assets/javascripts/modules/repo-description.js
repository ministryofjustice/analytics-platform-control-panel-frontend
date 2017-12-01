'use strict';

moj.Modules.repoDescription = {
  repoPrefix: 'https://github.com',
  apiUrlPrefix: 'https://api.github.com/repos',
  orgSelectName: 'repo_org',
  repoSlugInputName: 'name',
  repoUrlHiddenInputName: 'repo_url',
  descriptionInputName: 'description',

  messages: {
    checking: 'Looking up repo...',
    not_found: 'Repo not found',
    found: 'Repo found'
  },

  init: function() {
    var self = this;
    self.$repoSlugInput = $('#' + self.repoSlugInputName);
    self.$orgSelect = $('#' + self.orgSelectName);
    self.$repoUrlHiddenInput = $('#' + self.repoUrlHiddenInputName);

    if (self.$repoSlugInput.length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
      check = function() {
        if(self.$repoSlugInput.val()) {
          self.getRepoDescription();
        } else {
          $('#repo-check, #repo-checking, #repo-results').addClass('js-hidden');
        }
      };

    self.$repoSlugInput.on('blur', check);
    self.$orgSelect.on('change', check);
  },

  getRepoDescription: function() {
    var self = this,
      repoUrl = self.concatUrl(self.repoPrefix),
      apiUrl = self.concatUrl(self.apiUrlPrefix);

    $('#repo-check, #repo-checking, .spinner').removeClass('js-hidden');
    $('#repo-checking p').removeClass('success error').text(self.messages.checking);
    $('#repo-results').addClass('js-hidden');

    $.ajax({
      method: 'GET',
      dataType: 'jsonp',
      callback: 'callback',
      url: apiUrl,
      success: function(response, textStatus, jqxhr) {
        self.updateDescription(response.data);
        self.$repoUrlHiddenInput.val(repoUrl);
      },
      error: function(jqxhr, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(jqxhr);

        self.$repoUrlHiddenInput.val('');
      }
    });
  },

  concatUrl: function(prefix) {
    var self = this,
      org = self.$orgSelect.val(),
      slug = self.$repoSlugInput.val();

    return [prefix, org, slug].join('/');
  },

  updateDescription: function(data) {
    var self = this,
      description = data.description || '';

    $('#repo-check, #repo-results').removeClass('js-hidden');
    $('#repo-checking .spinner').addClass('js-hidden');

    if(data.id) {
      $('#' + self.descriptionInputName).val(description);
      if(description) {
        $('#repo-' + self.descriptionInputName).text(description);
      } else {
        $('#repo-' + self.descriptionInputName).text('None provided');
      }
      $('#repo-checking p').removeClass('error').addClass('success').text(self.messages.found);
      $('#repo-results').removeClass('js-hidden');
    } else {
      $('#repo-checking p').removeClass('success').addClass('error').text(self.messages.not_found);
      $('#repo-results').addClass('js-hidden');
    }

  }
};
