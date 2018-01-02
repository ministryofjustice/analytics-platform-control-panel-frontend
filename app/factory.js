const express = require('express');
const { join } = require('path');

const config = require('./config');


function init_app(app, conf) {
  app.set('env', conf.app.env);

  const nunjucks = require('nunjucks'); // eslint-disable-line global-require
  nunjucks.configure(join(__dirname, 'templates'), {
    autoescape: true,
    express: app,
  });
}

function init_middleware(app, conf) {
  const log = require('bole')('middleware'); // eslint-disable-line global-require

  conf.middleware.forEach((name) => {
    const middleware = require(`./middleware/${name}`)(app, conf, log); // eslint-disable-line global-require
    app.use(middleware);
  });
}


exports.create_app = function (config_override) {
  const app = express();

  const conf = Object.assign(config, config_override);

  init_app(app, conf);
  init_middleware(app, conf);

  return app;
};
