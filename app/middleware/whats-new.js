const request = require('request-promise');
const crypto = require('crypto');


module.exports = (app, conf, log) => {
  log.info('adding what\'s new');

  return (req, res, next) => {
    if (req.session && !req.session.whats_new_hash) {
      return request(conf.whats_new.url)
        .then((markdown_body) => {
          const hash = crypto.createHash('sha256').update(markdown_body, 'utf8').digest('hex');
          req.session.whats_new_hash = hash;
          res.locals.whats_new_hash = hash;
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
