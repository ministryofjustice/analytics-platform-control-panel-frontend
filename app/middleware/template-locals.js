/*
Examples:

 - yes_no(is_admin) // => 'Yes' / 'No'
 - yes_no(access_level, 'readwrite') // => 'Yes' / 'No'
 - yes_no(is_admin, true, '(Admin)', '') // => '(Admin)' / ''
 - yes_no(access, 'readwrite', 'Revoke', 'Grant') // => 'Revoke' / 'Grant'
*/
function yes_no(value, true_value=true, yes_str='Yes', no_str='No') {
  if (value === true_value) {
    return yes_str;
  } else {
    return no_str;
  }
}

module.exports = (app, conf, log) => {
  log.info('adding template-locals');
  return (req, res, next) => {
    app.locals.asset_path = conf.app.asset_path;
    app.locals.current_user = req.user || null;
    app.locals.env = process.env;
    app.locals.req = req;
    app.locals.yes_no = yes_no;
    next();
  };
};
