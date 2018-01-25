const cls = require('continuation-local-storage');


module.exports = (app, conf, log) => {
  log.info('adding continuation local storage');

  const ns = cls.createNamespace(conf.continuation_locals.namespace);

  return (req, res, next) => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
      next();
    });
  };
};
