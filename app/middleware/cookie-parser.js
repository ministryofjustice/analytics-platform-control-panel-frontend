module.exports = (app, conf, log) => {
  log.debug('adding cookie-parser');
  return require('cookie-parser')();
};
