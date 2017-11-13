require('dotenv').config();
const bole = require('bole');

const config = require('./config');
const factory = require('./factory');


bole.output(config.log);

module.exports = factory.create_app();
