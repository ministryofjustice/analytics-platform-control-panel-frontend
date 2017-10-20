var url_for = require('./routes').url_for;


module.exports = function (err, req, res, next) {

  if (res.headersSent) {
    return next(err);
  }

  if (api_access_denied(err)) {
    redirect_to_login(req, res, {return_to: req.url});

  } else {
    show_error(res);
  }
};


function api_access_denied(err) {
  return err.statusCode && err.statusCode === 403;
}


function redirect_to_login(req, res, options) {

  if (options.return_to) {
    req.session.returnTo = options.return_to;
  }

  res.redirect(url_for('base.home'));
}


function show_error(res, err) {
  res.status(500);
  res.render('errors/internal-error.html', {'error': err});
}
