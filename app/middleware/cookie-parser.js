module.exports = (app, conf, log) => {
  log.info('adding cookie-parser');
  return require('cookie-parser')();
};
