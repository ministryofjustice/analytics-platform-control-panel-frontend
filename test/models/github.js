const { assert } = require('chai');
const nock = require('nock');
const { ModelSet } = require('../../app/models/base');
const { Repo } = require('../../app/models/github');
const { api } = require('../../app/api_clients/github');


describe('Github model', () => {

  describe('Repo', () => {

    it('list method returns a ModelSet of Repo objects', () => {
      const repos_response = require('../fixtures/repos');
      const get_repos = nock('https://api.github.com')
        .get('/user/repos?visibility=all')
        .reply(200, repos_response);
      const expected = new ModelSet(Repo, repos_response);

      return Repo.list({ visibility: 'all' })
        .then((repos) => {
          assert.deepEqual(repos, expected);
        });
    });
  });
});
