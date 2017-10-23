var url_for = require('./routes').url_for;


module.exports = function (err, req, res, next) {

  if (res.headersSent) {
    return next(err);
  }

  show_error(res, err);
};


function show_error(res, err) {
  res.status(500);
  res.render('errors/internal-error.html', {'error': err});
}
