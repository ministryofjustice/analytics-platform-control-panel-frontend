const { tools_domain } = require('../config').cluster;


exports.get_tool_url = (tool_name, username) => `https://${username}-${tool_name}.${tools_domain}`;
