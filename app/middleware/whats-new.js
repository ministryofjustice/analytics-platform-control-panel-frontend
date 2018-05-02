const request = require('request-promise');


module.exports = (app, conf, log) => {
  log.info('adding what\'s new');

  return (req, res, next) => {
    if (req.session && !req.session.whats_new_hash) {
      return request({
        method: 'HEAD',
        uri: conf.whats_new.url,
      })
        .then((result) => {
          req.session.whats_new_hash = result.etag;
          res.locals.whats_new_hash = result.etag;
          return next();
        })
        .catch((error) => {
          throw error;
        });
    }
    res.locals.whats_new_hash = req.session.whats_new_hash;
    return next();
  };
};
