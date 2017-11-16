module.exports = (app, conf, log) => {
  log.info('adding body-parser');
  return require('body-parser').urlencoded({extended: true});
};
