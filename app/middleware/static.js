const express = require('express');


module.exports = (app, conf, log) => {
  log.info('adding static');

  const router = new express.Router();

  Object.keys(conf.static.paths).forEach((pattern) => {
    conf.static.paths[pattern].forEach((path) => {
      router.use(pattern, express.static(path));
    });
  });

  return router;
};
