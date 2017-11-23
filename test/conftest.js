"use strict";

const nock = require('nock');

const { url_for } = require('../app/routes');


exports.config = require('../app/config');
exports.mock_api = () => { return nock(exports.config.api.base_url); };
exports.url_for = url_for;
