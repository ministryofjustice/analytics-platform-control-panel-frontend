var app = require('./index');
var config = require('./config');
var bole = require('bole');


bole.output({level: config.log.level, stream: process.stdout});
var log = bole('server');

log.info('Server process starting');


app.listen(config.express.port, config.express.host, function (error) {

  if (error) {
    log.error('Unable to listen for connections', error);
    process.exit(10);
  }

  log.info('Express listening on http://' + config.express.host + ':' +
    config.express.port);
});
