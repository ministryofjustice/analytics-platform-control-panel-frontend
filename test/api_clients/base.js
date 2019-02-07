const { assert } = require('chai');
const { config, mock_api } = require('../conftest');

const base = require('../../app/api_clients/base');


describe('Base API Client', () => {
  const client = new base.APIClient(config.api);

  it('can make a GET request', () => {
    const expected = {
      url: '/apps?param1=1&param2=foo',
    };
    const request = mock_api()
      .get(expected.url)
      .reply(200);

    return client.get('apps', { param1: 1, param2: 'foo' })
      .then(() => {
        assert(request.isDone());
      });
  });

  it('can make a POST request', () => {
    const expected = {
      url: '/apps',
      body: {
        foo: 'bar',
        baz: 'quux',
      },
    };
    const request = mock_api()
      .post(expected.url, expected.body)
      .reply(200);

    return client.post('apps', expected.body)
      .then(() => {
        assert(request.isDone());
      });
  });

  it('can make a DELETE request', () => {
    const expected = {
      url: '/apps/1',
    };
    const request = mock_api()
      .delete(expected.url)
      .reply(204);

    return client.delete('apps/1')
      .then(() => {
        assert(request.isDone());
      });
  });

  it('can make a PATCH request', () => {
    const expected = {
      url: '/apps/1',
      body: {
        foo: 'bar',
      },
    };
    const request = mock_api()
      .patch(expected.url, expected.body)
      .reply(200);

    return client.patch('apps/1', expected.body)
      .then(() => {
        assert(request.isDone());
      });
  });

  it('throws an exception if authentication fails', () => {
    const expected = {
      url: '/apps',
    };
    const request = mock_api()
      .get(expected.url)
      .reply(403);

    return client.get('apps')
      .then(() => {
        assert.fail('Expected exception was not thrown');
      })
      .catch((error) => {
        assert(request.isDone());
        assert.instanceOf(error, base.APIForbidden);
      });
  });

  it('throws an exception if there were other errors', () => {
    const expected = {
      url: '/apps',
    };
    const request = mock_api()
      .get(expected.url)
      .reply(500);

    return client.get('apps')
      .then(() => {
        assert.fail('Expected exception was not thrown');
      })
      .catch((error) => {
        assert(request.isDone());
        assert.equal(error.statusCode, 500);
      });
  });
});
