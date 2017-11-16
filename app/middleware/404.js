module.exports = (app, conf, log) => {
  log.info('adding 404');
  return (req, res) => {
    res.status(404).render('errors/not-found.html');
  };
};
