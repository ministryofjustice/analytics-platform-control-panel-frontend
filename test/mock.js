"use strict";
var config = require('../app/config');
var nock = require('nock');
var routes = require('../app/routes');


module.exports = {

  api: nock(config.api.base_url),

  url_for: routes.url_for

};
