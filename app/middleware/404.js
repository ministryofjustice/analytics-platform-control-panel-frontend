module.exports = (app, conf, log) => {
  log.debug('adding 404');
  return (req, res) => {
    res.status(404).render('errors/not-found.html');
  };
};
