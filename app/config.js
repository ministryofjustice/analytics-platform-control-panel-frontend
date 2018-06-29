const { join } = require('path');


const config = module.exports;
const node_modules = join(__dirname, '../node_modules');

config.access_logs = {
  ranges: [
    {
      text: '7 days',
      value: 7,
      default: false,
    },
    {
      text: '30 days',
      value: 30,
      default: true,
    },
    {
      text: 'All',
      value: 0,
      default: false,
    },
  ],
};

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

config.aws = {
  login_base_url: process.env.AWS_LOGIN_BASE_URL || `https://aws.services.${process.env.ENV}.mojanalytics.xyz`,
  bucket_url: (name, region = 'eu-west-1') => {
    const destination = escape(`/s3/buckets/${name}/?region=${region}&tab=overview`);
    return `${config.aws.login_base_url}/?destination=${destination}`;
  },
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

config.marked = {
  // since the markdown being pulled in for "What's new?" is viewed/edited via github,
  // it would likely be a good idea to use github-flavoured markdown
  gfm: true,
};

config.ensure_login = {
  exclude: [
    /^\/callback/,
    /^\/error/,
    /^\/healthz/,
    /^\/login/,
    /^\/logout/,
    /^\/static/,
  ],
};

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  host: process.env.EXPRESS_HOST || '127.0.0.1',
};

config.grafana = {
  dashboard_url: `https://grafana.services.${process.env.ENV}.mojanalytics.xyz/d/000000002/platform-users?refresh=10s&orgId=1`,
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
  'whats-new',
  'routes',
  '404',
  'raven-error-handler',
  'errors',
];

config.github = {
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
      join(node_modules, 'jquery-modal'),
    ],
    '/static/images/icons': [
      join(node_modules, 'govuk_frontend_toolkit/images'),
    ],
  },
};

config.whats_new = {
  url: 'https://raw.githubusercontent.com/moj-analytical-services/platform_user_guidance/master/changelog/whats_new.md',
};
