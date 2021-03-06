const { assert } = require('chai');
const { config, withAPI } = require('../conftest');
const nock = require('nock');
const { ModelSet, Repo } = require('../../app/models');

const repos_response = require('../fixtures/repos');


describe('Github model', () => {
  describe('Repo', () => {
    it('list method returns a ModelSet of Repo objects', withAPI(() => {
      config.github.orgs = [
        'test-org-1',
        'test-org-2',
      ];

      config.github.orgs.forEach((org) => {
        nock(`https://${config.github.host}`)
          .get(`/orgs/${org}/repos?type=all&page=1&per_page=100`)
          .reply(200, repos_response);
      });

      const expected = new ModelSet(Repo, []).concat(
        new ModelSet(Repo, repos_response),
        new ModelSet(Repo, repos_response),
      );

      return Repo.list()
        .then((repos) => {
          assert.deepEqual(repos, expected);
        });
    }));
  });
});
