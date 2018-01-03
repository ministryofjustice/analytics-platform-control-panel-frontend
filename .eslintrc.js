module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
  },
  "globals": {
    "$": false,
    "document": false,
    "moj": true,
    "Auth0Lock": true,
  },
  "rules": {
    "camelcase": ["off"],
    "no-use-before-define": ["error", { "classes": false }],
    "no-alert": 0,
  },
};
