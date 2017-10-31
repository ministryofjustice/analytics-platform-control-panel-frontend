"use strict";
var config = require('../app/config');
var nock = require('nock');


module.exports = {

  api: nock(config.api.base_url)

};
