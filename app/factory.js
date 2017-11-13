const express = require('express');
const join = require('path').join;

const config = require('./config');


module.exports = function (config_override) {

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
  const middleware = require('./middleware');

  conf.middleware.forEach((name) => {
    app.use(middleware[name](app, conf));
  });
}
