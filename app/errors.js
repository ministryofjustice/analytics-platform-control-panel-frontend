function notFound(req, res) {
  res.status(404).render('errors/not-found.html');
}

module.exports = notFound;
