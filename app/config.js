const { join } = require('path');


const config = module.exports;
const node_modules = join(__dirname, '../node_modules');

config.api = {
  base_url: process.env.API_URL || 'http://localhost:8000',
  username: process.env.API_USER,
  password: process.env.API_PASSWORD,
};

config.app = {
  env: process.env.ENV || 'dev',
  asset_path: '/static/',
  protocol: process.env.APP_PROTOCOL || 'http',
  host: process.env.APP_HOST || 'localhost:3000',
};

config.apps = [
  'base',
  'apps',
  'users',
  'buckets',
  'apps3buckets',
  'tools',
  'users3buckets',
  'userapps',
];

config.auth0 = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  passReqToCallback: true,
  clockTolerance: 10,
  timeout: 5000,
  retries: 2,
  sessionKey: `oidc:${process.env.AUTH0_DOMAIN}`,
  scope: 'openid email profile offline_access',
  sso_logout_url: '/v2/logout',
};

config.babel = {
  presets: ['es2015'],
};

config.cluster = {
  tools_domain: process.env.TOOLS_DOMAIN,
};

config.continuation_locals = {
  namespace: 'cpfrontend',
};

config.cookie = {
  secret: process.env.COOKIE_SECRET || 'shh-its-a-secret',
};

config.ensure_login = {
  exclude: [
    /^\/callback/,
    /^\/error/,
    /^\/login/,
    /^\/logout/,
    /^\/static/,
  ],
};

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || '127.0.0.1',
};

config.js = {
  sourceFiles: join(__dirname, 'assets/javascripts/**/*.js'),
  ignorePaths: [
    join(__dirname, 'assets/javascripts/vendor/**/*'),
  ],
  outDir: join(__dirname, '../static/javascripts/'),
  filename: 'app.js',
};

config.log = {
  requests: process.env.ENABLE_ACCESS_LOGS !== 'false',
  stream: process.stdout,
  level: process.env.NODE_LOG_LEVEL || 'debug',
};

// order is important!
config.middleware = [
  'continuation-locals',
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
  'errors',
];

config.github = {
  host: 'api.github.com',
  web_host: 'https://github.com',
  orgs: [
    'moj-analytical-services',
    'ministryofjustice',
  ],
};

config.sass = {
  sources: [
    {
      files: join(__dirname, 'assets/sass/**.scss'),
      includePaths: [
        join(node_modules, 'govuk_frontend_toolkit/stylesheets'),
        join(node_modules, 'govuk_template_jinja/assets/stylesheets'),
        join(node_modules, 'govuk-elements-sass/public/sass'),
      ],
      outputStyle: 'expanded',
      sourceMap: true,
      outDir: join(__dirname, '../static/stylesheets/'),
    },
  ],
};

config.sentry = {
  dsn: process.env.SENTRY_DSN,
  options: {
    autoBreadcrumbs: {
      console: true,
      http: true,
    },
    tags: {
      environment: process.env.ENV || 'dev',
    },
  },
};

config.session = {
  cookie: {
    maxAge: ((maxAge) => {
      if (Number.isNaN(maxAge)) {
        return 1 * 60 * 60 * 1000; // 1 hours
      }
      return maxAge;
    })(Number.parseInt(process.env.COOKIE_MAXAGE, 10)),
  },
  logFn: console.log, // eslint-disable-line no-console
  name: 'session',
  resave: false,
  saveUninitialized: false,
  secret: config.cookie.secret,
};

config.session_store = {
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
  logErrors: true,
  pass: process.env.REDIS_PASSWORD,
};

config.static = {
  paths: {
    '/static': [
      join(__dirname, '../static'),
      join(node_modules, 'govuk_template_jinja/assets'),
      join(node_modules, 'govuk_frontend_toolkit'),
      join(node_modules, 'jquery/dist'),
      join(node_modules, 'jquery-typeahead/dist'),
    ],
    '/static/images/icons': [
      join(node_modules, 'govuk_frontend_toolkit/images'),
    ],
  },
};
