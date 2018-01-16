const body_parser = require('body-parser');


module.exports = (app, conf, log) => {
  log.info('adding body-parser');
  return body_parser.urlencoded({ extended: true });
};
