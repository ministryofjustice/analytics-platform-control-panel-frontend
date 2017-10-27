var views = require('./views');


module.exports = [

  {name: 'home', pattern: '/', view: views.home},
  {name: 'callback', pattern: '/callback', view: views.auth_callback},
  {name: 'login', pattern: '/login', view: views.login},
  {name: 'logout', pattern: '/logout', view: views.logout},
  {name: 'error', pattern: '/error', view: views.error_test}

];
