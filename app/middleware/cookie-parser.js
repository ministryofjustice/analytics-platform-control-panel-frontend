const cookie_parser = require('cookie-parser');

module.exports = (app, conf, log) => {
  log.info('adding cookie-parser');
  return cookie_parser(conf.cookie.secret);
};
