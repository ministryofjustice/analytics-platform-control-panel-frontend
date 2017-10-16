var assets = require('../app/assets');
var bole = require('bole');

bole.output({level: process.env.LOG_LEVEL || 'debug', stream: process.stdout});

assets.compile_sass();
assets.compile_js();
