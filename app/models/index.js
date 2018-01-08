module.exports = Object.assign(
  {},
  require('./base'),
  require('./control_panel_api'),
  require('./kubernetes'),
  require('./github')
);
