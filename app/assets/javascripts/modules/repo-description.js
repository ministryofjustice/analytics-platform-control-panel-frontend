moj.Modules.repoDescription = {
  repoPrefix: 'https://github.com',
  apiUrlPrefix: 'https://api.github.com/repos',
  orgSelectName: 'repo_org',
  repoSlugSelectName: 'name',
  repoUrlHiddenInputName: 'repo_url',
  descriptionInputName: 'description',

  init() {
    const self = this;

    self.$repoSlugSelect = $(`#${self.repoSlugSelectName}`);
    self.$orgSelect = $(`#${self.orgSelectName}`);
    self.$repoUrlHiddenInput = $(`#${self.repoUrlHiddenInputName}`);

    if (self.$repoSlugSelect.length) {
      self.bindEvents();
      self.showOrgRepos();
    }
  },

  bindEvents() {
    const self = this;

    self.$repoSlugSelect.on('change', () => {
      if (self.$repoSlugSelect.val()) {
        self.getRepoDescription();
      } else {
        self.updateDescription('');
        $('#repo-results').addClass('js-hidden');
      }
    });
    self.$orgSelect.on('change', () => {
      self.showOrgRepos();
    });
  },

  showOrgRepos() {
    const self = this;
    const currentOrg = self.$orgSelect.val();

    $('optgroup.org-repos').hide();
    $(`optgroup[label="${currentOrg}"]`).show();
    self.$repoSlugSelect.find('option').eq(0).prop('selected', true);
    self.updateDescription('');
    $('#repo-results').addClass('js-hidden');
  },

  getRepoDescription() {
    const self = this;
    const repoUrl = self.concatUrl(self.repoPrefix);
    const description = self.$repoSlugSelect.find('option:selected').data('description');

    self.updateDescription(description);
    self.$repoUrlHiddenInput.val(repoUrl);
    $('#repo-results').removeClass('js-hidden');
  },

  concatUrl(prefix) {
    const self = this;
    const org = self.$orgSelect.val();
    const slug = self.$repoSlugSelect.val();

    return [prefix, org, slug].join('/');
  },

  updateDescription(description) {
    const self = this;

    if (description) {
      $(`#${self.descriptionInputName}`).val(description);
      $(`#repo-${self.descriptionInputName}`).text(description);
    } else {
      $(`#repo-${self.descriptionInputName}`).text('None provided');
      $(`#${self.descriptionInputName}`).val('');
    }
  },
};
