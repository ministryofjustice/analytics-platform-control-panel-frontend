const config = require('./config');
const express = require('express');
const { join } = require('path');
const log = require('bole')('middleware');
const nunjucks = require('nunjucks');


function init_app(app, conf) {
  app.set('env', conf.app.env);

  nunjucks.configure(join(__dirname, 'templates'), {
    autoescape: true,
    express: app,
  });
}

function init_middleware(app, conf) {
  conf.middleware.forEach((name) => {
    app.use(require(`./middleware/${name}`)(app, conf, log)); // eslint-disable-line global-require
  });
}


exports.create_app = (config_override) => {
  const app = express();

  const conf = Object.assign(config, config_override);

  init_app(app, conf);
  init_middleware(app, conf);

  return app;
};
