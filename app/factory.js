const express = require('express');
const join = require('path').join;

const config = require('./config');


exports.create_app = function (config_override) {

  const app = express();

  let conf = Object.assign(config, config_override);

  init_app(app, conf);
  init_middleware(app, conf);

  return app;
};


function init_app(app, conf) {
  app.set('env', conf.app.env);

  const nunjucks = require('nunjucks');
  nunjucks.configure(join(__dirname, 'templates'), {
    autoescape: true,
    express: app
  });
}


function init_middleware(app, conf) {
  let log = require('bole')('middleware');

  conf.middleware.forEach((name) => {
    let middleware = require(`./middleware/${name}`)(app, conf, log);
    app.use(middleware);
  });
}
