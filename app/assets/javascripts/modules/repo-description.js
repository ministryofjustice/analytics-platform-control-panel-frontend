moj.Modules.repoDescription = {
  repoPrefix: 'https://github.com',
  apiUrlPrefix: 'https://api.github.com/repos',
  orgSelectName: 'repo_org',
  repoSlugSelectName: 'name',
  repoUrlHiddenInputName: 'repo_url',
  descriptionInputName: 'description',

  init() {
    this.$repoSlugSelect = $(`#${this.repoSlugSelectName}`);
    this.$orgSelect = $(`#${this.orgSelectName}`);
    this.$repoUrlHiddenInput = $(`#${this.repoUrlHiddenInputName}`);

    if (this.$repoSlugSelect.length) {
      this.bindEvents();
      this.showOrgRepos();
    }
  },

  bindEvents() {
    this.$repoSlugSelect.on('change', () => {
      if (this.$repoSlugSelect.val()) {
        this.getRepoDescription();
      } else {
        this.updateDescription('');
        $('#repo-results').addClass('js-hidden');
      }
    });
    this.$orgSelect.on('change', () => {
      this.showOrgRepos();
    });
  },

  showOrgRepos() {
    const currentOrg = this.$orgSelect.val();

    $('optgroup.org-repos').hide();
    $(`optgroup[label="${currentOrg}"]`).show();
    this.$repoSlugSelect.find('option').eq(0).prop('selected', true);
    this.updateDescription('');
    $('#repo-results').addClass('js-hidden');
  },

  getRepoDescription() {
    const repoUrl = this.concatUrl(this.repoPrefix);
    const description = this.$repoSlugSelect.find('option:selected').data('description');

    this.updateDescription(description);
    this.$repoUrlHiddenInput.val(repoUrl);
    $('#repo-results').removeClass('js-hidden');
  },

  concatUrl(prefix) {
    const org = this.$orgSelect.val();
    const slug = this.$repoSlugSelect.val();

    return [prefix, org, slug].join('/');
  },

  updateDescription(description) {
    if (description) {
      $(`#${this.descriptionInputName}`).val(description);
      $(`#repo-${this.descriptionInputName}`).text(description);
    } else {
      $(`#repo-${this.descriptionInputName}`).text('None provided');
      $(`#${this.descriptionInputName}`).val('');
    }
  },
};
