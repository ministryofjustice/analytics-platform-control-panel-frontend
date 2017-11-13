require('dotenv').config();
const bole = require('bole');

const config = require('./config');
const create_app = require('./factory');


bole.output(config.log);

module.exports = create_app();
