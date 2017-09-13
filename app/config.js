var config = module.exports;
var PROD = process.env.ENV === 'prod';


config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || '127.0.0.1'
}

config.log = {
  level: process.env.LOG_LEVEL || 'debug'
}


if (PROD) {
  config.express.host = '0.0.0.0';
}
