moj.Modules.repoDescription = {
  repoPrefix: 'https://github.com',
  orgSelectName: 'repo_org',
  repoSlugSelectName: 'name',
  repoSlugTypeaheadName: 'repo_typeahead',
  repoUrlHiddenInputName: 'repo_url',
  descriptionInputName: 'description',
  repoSelected: null,

  init() {
    this.$repoSlugSelect = $(`#${this.repoSlugSelectName}`);
    this.$orgSelect = $(`#${this.orgSelectName}`);
    this.$repoUrlHiddenInput = $(`#${this.repoUrlHiddenInputName}`);
    this.$repoSlugTypeahead = $(`#${this.repoSlugTypeaheadName}`);

    if (this.$repoSlugSelect.length) {
      this.bindEvents();
      this.showOrgRepos();
    }
  },

  bindEvents() {
    this.$orgSelect.on('change', () => {
      this.showOrgRepos();
    });
  },

  showOrgRepos() {
    const currentOrg = this.$orgSelect.val();
    const repoOptions = Array.from($(`optgroup[label="${currentOrg}"] option`));
    const repos = repoOptions.map(opt => opt.text);
    const descriptions = repoOptions.map(opt => opt.dataset.description);

    // reset potentially pre-existing typeahead
    this.repoSelected = false;
    this.$repoSlugSelect.hide();
    this.$repoSlugTypeahead.val('');
    $('.typeahead__result, .typeahead__cancel-button').remove();
    $('.typeahead__container').removeClass('cancel');

    // initialise repo-typeahead for selected org
    this.$repoSlugTypeahead.typeahead({
      order: 'asc',
      maxItem: 0,
      source: {
        data: repos,
      },
      callback: {
        onClickAfter: (node) => {
          const index = repos.indexOf(node[0].value);

          this.getRepoDescription(descriptions[index]);
          this.repoSelected = true;
        },
        onCancel: () => {
          this.updateDescription('');
          $('#repo-results').addClass('js-hidden');
          this.repoSelected = false;
        },
        onSubmit: () => {
          if (!this.repoSelected) {
            return false;
          }
          return true;
        },
      },
    });

    this.updateDescription('');
    $('#repo-results').addClass('js-hidden');
  },

  getRepoDescription(description) {
    const repoUrl = this.concatUrl(this.repoPrefix);

    this.updateDescription(description);
    this.$repoUrlHiddenInput.val(repoUrl);
    $('#repo-results').removeClass('js-hidden');
  },

  concatUrl(prefix) {
    const org = this.$orgSelect.val();
    const slug = this.$repoSlugTypeahead.val();

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
