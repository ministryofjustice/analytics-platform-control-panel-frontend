const { assert } = require('chai');
const { config } = require('../conftest');
const nock = require('nock');
const { ModelSet } = require('../../app/models/base');
const { Repo } = require('../../app/models/github');


describe('Github model', () => {
  describe('Repo', () => {
    it('list method returns a ModelSet of Repo objects', () => {
      const repos_response = require('../fixtures/repos');

      config.github.orgs = [
        'test-org-1',
        'test-org-2',
      ];

      const get_org_repos = config.github.orgs.map((org) => {
        return nock(`https://${config.github.host}`)
          .get(`/orgs/${org}/repos?type=all&page=1&per_page=500`)
          .reply(200, repos_response);
      });

      const expected = new ModelSet(Repo, []).concat(
        new ModelSet(Repo, repos_response),
        new ModelSet(Repo, repos_response)
      );

      return Repo.list()
        .then((repos) => {
          assert.deepEqual(repos, expected);
        });
    });
  });
});
