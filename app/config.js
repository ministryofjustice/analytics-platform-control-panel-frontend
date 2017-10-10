var join = require('path').join;
var config = module.exports;
var PROD = process.env.ENV === 'prod';

var node_modules = join(__dirname, '../node_modules');


config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || '127.0.0.1'
};

config.log = {
  level: process.env.LOG_LEVEL || 'debug'
};

config.apps = [
  'base',
  'apps',
  'users'
];

config.session = {
  secret: process.env.COOKIE_SECRET || 'shh-its-a-secret',
  resave: true,
  saveUninitialized: true
};

config.sass = {
  sources: [
    {
      files: join(__dirname, 'assets/sass/**.scss'),
      includePaths: [
        join(node_modules, 'govuk_frontend_toolkit/stylesheets'),
        join(node_modules, 'govuk_template_jinja/assets/stylesheets'),
        join(node_modules, 'govuk-elements-sass/public/sass')
      ],
      outputStyle: 'expanded',
      sourceMap: true,
      outDir: join(__dirname, '../static/stylesheets/')
    }
  ]
};

config.static = {
  paths: {
    '/static': [
      join(__dirname, '../static'),
      join(node_modules, 'govuk_template_jinja/assets'),
      join(node_modules, 'govuk_frontend_toolkit')
    ],
    '/static/images/icons': [
      join(node_modules, 'govuk_frontend_toolkit/images')
    ]
  }
};

config.api = {
  base_url: process.env.API_URL || 'http://localhost:8000',
  username: process.env.API_USER,
  password: process.env.API_PASSWORD
};

if (PROD) {
  config.express.host = '0.0.0.0';
}
