const { assert } = require('chai');
const app = require('express')();
const config = require('../../app/config');
const log = require('bole')('middleware');
const errors_middleware = require('../../app/middleware/errors')(app, config, log);


describe('When a "state mismatch" error occurs', () => {
  it('redirects the user to /login', () => {
    let spy_session_destroyed = false;
    let spy_cookie_cleared = 'NOT CLEARED';
    let spy_redirected_to = 'NOT REDIRECTED';
    let spy_next_called = false;

    const err = Error('state mismatch, could not find [...]');
    const req = {
      session: {
        destroy: (after_destroy) => {
          spy_session_destroyed = true;
          after_destroy();
        },
      },
    };
    const res = {
      clearCookie: (name) => {
        spy_cookie_cleared = name;
      },
      redirect: (url) => {
        spy_redirected_to = url;
      },
    };
    const next = () => {
      spy_next_called = true;
    };

    errors_middleware(err, req, res, next)

    assert.isTrue(spy_session_destroyed);
    assert.equal(spy_cookie_cleared, config.session.name);
    assert.equal(spy_redirected_to, '/login');
    assert.isFalse(spy_next_called, 'next() called');
  });
});
