const { assert } = require('chai');
const { mock_api, withAPI } = require('../conftest');
const { App, DoesNotExist } = require('../../app/models');
const apps_response = require('../fixtures/apps');


describe('Control Panel API Model', () => {
  it('has a primary key', () => {
    assert.equal(App.pk, 'id');
  });

  it('has an endpoint', () => {
    assert.equal(App.endpoint, 'apps');
  });

  it('lists all instances', withAPI(() => {
    mock_api()
      .get('/apps/')
      .reply(200, apps_response);

    return App.list()
      .then((apps) => {
        assert.equal(apps.length, apps_response.results.length);
        assert.instanceOf(apps[0], App);
        assert.instanceOf(apps[1], App);
      });
  }));

  it('can Create an instance', withAPI(() => {
    const app_data = {
      name: 'test-app',
    };
    const expected = {
      id: 1,
      name: app_data.name,
    };
    mock_api()
      .post('/apps/')
      .reply(201, expected);

    return App.create(app_data)
      .then((new_app) => {
        assert.exists(new_app[App.pk]);
        assert.equal(new_app.name, expected.name);
      });
  }));

  it('Retrieves an instance by primary key', withAPI(() => {
    mock_api()
      .get('/apps/1/')
      .reply(200, apps_response.results[0]);

    return App.get(1)
      .then((app) => {
        assert.equal(app[App.pk], 1);
      });
  }));

  it('throws an exception if no instance found', withAPI(() => {
    mock_api()
      .get('/apps/0/')
      .reply(404, 'Not Found');

    return App.get(0)
      .then(() => {
        assert.fail('Expected failure');
      })
      .catch((error) => {
        assert.instanceOf(error, DoesNotExist);
      });
  }));

  it('Deletes an instance by primary key', withAPI(() => {
    mock_api()
      .delete('/apps/1/')
      .reply(204);

    return App.delete(1);
  }));

  describe('instance', () => {
    it('can be Created', withAPI(() => {
      const app_data = {
        name: 'test-app',
      };
      const expected = {
        id: 1,
        name: app_data.name,
      };
      mock_api()
        .post('/apps/')
        .reply(201, expected);

      return new App(app_data).create()
        .then((new_app) => {
          assert.exists(new_app[App.pk]);
          assert.equal(new_app.name, expected.name);
        });
    }));

    it('can be Updated', withAPI(() => {
      const app_data = {
        name: 'test-app',
      };
      const expected = {
        id: 1,
        name: app_data.name,
      };
      mock_api()
        .patch('/apps/1/')
        .reply(200, expected);

      const existing_app = new App({
        id: 1,
        name: 'testing-123',
      });

      return existing_app.update(app_data)
        .then((updated_app) => {
          assert.equal(updated_app.name, app_data.name);
        });
    }));

    it('can be Deleted', withAPI(() => {
      const existing_app = new App({ id: 1 });

      mock_api()
        .delete('/apps/1/')
        .reply(204);

      return existing_app.delete();
    }));
  });
});
