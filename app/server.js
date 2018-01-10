const app = require('./index');
const assets = require('./assets');
const config = require('./config').express;

const log = require('bole')('server');


log.info('Server process starting');


if (process.env.ENV !== 'prod') {
  assets.compile_sass();
  assets.compile_js();
}

app.listen(config.port, config.host, (error) => {
  if (error) {
    log.error('Unable to listen for connections', error);
    process.exit(10);
  }

  log.info(`Express listening on http://${config.host}:${config.port}`);
});
