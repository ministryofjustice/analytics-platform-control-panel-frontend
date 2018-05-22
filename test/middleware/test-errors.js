const chai = require('chai');
const { expect } = require('chai');
const spies = require('chai-spies');

const app = require('express')();
const config = require('../../app/config');
const log = require('bole')('middleware');
const errors_middleware = require('../../app/middleware/errors')(app, config, log);


chai.use(spies);

describe('When a "state mismatch" error occurs', () => {
  it('redirects the user to /login', () => {
    const err = Error('state mismatch, could not find [...]');
    const req = {
      session: {
        destroy: chai.spy('req.session.destroy()', (fn) => fn()),
      },
    };
    const res = {
      clearCookie: chai.spy('res.clearCookie()'),
      redirect: chai.spy('res.redirect()'),
    };
    const next = chai.spy('next()');

    errors_middleware(err, req, res, next);

    expect(req.session.destroy).to.have.been.called();
    expect(res.clearCookie).to.have.been.called.with(config.session.name);
    expect(res.redirect).to.have.been.called.with('/login');
    expect(next).to.not.have.been.called();
  });
});
