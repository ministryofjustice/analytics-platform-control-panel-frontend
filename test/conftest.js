"use strict";
const config = require('../app/config');
const nock = require('nock');
const { load_routes, url_for } = require('../app/routes');


load_routes();

exports.config = config;
exports.mock_api = () => { return nock(exports.config.api.base_url); };
exports.url_for = url_for;
