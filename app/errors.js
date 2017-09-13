function notFound(req, res) {
  res.status(404).render('templates/errors/not-found.html');
}

module.exports = notFound;
