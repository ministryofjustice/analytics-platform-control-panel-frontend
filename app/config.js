const join = require('path').join;


const config = module.exports;
const node_modules = join(__dirname, '../node_modules');

config.api = {
  base_url: process.env.API_URL || 'http://localhost:8000',
  username: process.env.API_USER,
  password: process.env.API_PASSWORD
};

config.app = {
  env: process.env.ENV || 'dev',
  asset_path: '/static/'
};

config.apps = [
  'base',
  'apps',
  'users',
  'buckets',
  'apps3buckets',
  'users3buckets',
  'userapps',
];

config.auth0 = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  passReqToCallback: true
};

config.ensure_login = {
  exclude: [
    /^\/callback/,
    /^\/error/,
    /^\/login/,
    /^\/logout/,
    /^\/static/
  ]
};

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || '127.0.0.1'
};

config.js = {
  sourceFiles: join(__dirname, 'assets/javascripts/**/*.js'),
  ignorePaths: [
    join(__dirname, 'assets/javascripts/vendor/**/*')
  ],
  outDir: join(__dirname, '../static/javascripts/'),
  filename: 'app.js'
};

config.log = {
  requests: process.env.ENABLE_ACCESS_LOGS !== 'false',
  stream: process.stdout,
  level: process.env.LOG_LEVEL || 'debug'
};

// order is important!
config.middleware = [
  'raven-request-handler',
  'request-logging',
  'static',
  'cookie-parser',
  'body-parser',
  'session',
  'authentication',
  'api',
  'flash-messages',
  'template-locals',
  'ensure-login',
  'routes',
  '404',
  'raven-error-handler',
  'errors'
];

config.repos = {
  host: 'https://github.com',
  orgs: [
    'moj-analytical-services',
    'ministryofjustice',
  ]
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

config.sentry = {
  dsn: process.env.SENTRY_DSN,
  options: {
    autoBreadcrumbs: {
      console: true,
      http: true
    },
    tags: {
      environment: process.env.ENV || 'dev'
    }
  }
};

config.session = {
  name: 'session',
  secret: process.env.COOKIE_SECRET || 'shh-its-a-secret',
  resave: false,
  saveUninitialized: false,
  logFn: console.log
};

config.session_store = {
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  logErrors: true,
  pass: process.env.REDIS_PASSWORD
};

config.static = {
  paths: {
    '/static': [
      join(__dirname, '../static'),
      join(node_modules, 'govuk_template_jinja/assets'),
      join(node_modules, 'govuk_frontend_toolkit'),
      join(node_modules, 'jquery/dist')
    ],
    '/static/images/icons': [
      join(node_modules, 'govuk_frontend_toolkit/images')
    ]
  }
};
