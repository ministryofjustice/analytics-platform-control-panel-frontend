module.exports = (app, conf, log) => {
  log.debug('adding body-parser');
  return require('body-parser').urlencoded({extended: true});
};
