const { App, Bucket, User } = require('../models');
const { Repo } = require('../models/github');
const cls = require('cls-hooked');
const config = require('../config');
const { GithubAPIClient } = require('../api_clients/github');
const { url_for } = require('../routes');


exports.new = (req, res, next) => {
  const github_api = new GithubAPIClient(config);
  const ns = cls.getNamespace(config.continuation_locals.namespace);
  ns.set('github', github_api);
  github_api.authenticate(req.user)
    .then(() => Promise.all([Repo.list(), Bucket.list()]))
    .then(([repos, buckets]) => {
      res.render('apps/new.html', {
        repo_prefix: config.github.web_host,
        orgs: config.github.orgs,
        repos,
        bucket_prefix: `${process.env.ENV}-`,
        buckets: buckets.filter(bucket => !bucket.is_data_warehouse),
        errors: req.form_errors,
      });
    })
    .catch(next);
};


function app_from_form(form_data) {
  return new App({
    name: form_data.repo_typeahead,
    description: form_data.description,
    repo_url: form_data.repo_url,
    userapps: [],
  }).create();
}


function app_data_source(form_data) {
  return new Promise((resolve) => {
    switch (form_data['new-app-datasource']) {
      case 'create':
        new Bucket({ name: form_data['new-datasource-name'] })
          .create()
          .then(bucket => resolve(bucket.id));
        break;

      case 'select':
        resolve(form_data['select-existing-datasource']);
        break;

      default:
        resolve(null);
    }
  });
}


exports.create = (req, res, next) => {
  let app;

  Promise.all([app_from_form(req.body), app_data_source(req.body)])
    .then(([created_app, bucket_id]) => {
      app = created_app;

      if (bucket_id) {
        return app.grant_bucket_access(bucket_id, 'readonly');
      }

      return Promise.resolve(null);
    })
    .then(() => app.grant_user_access(req.user.auth0_id, 'readwrite', true))
    .then(() => {
      res.redirect(url_for('apps.details', { id: app.id }));
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        req.form_errors = error.error;
        return exports.new(req, res, next);
      }
      return next(error);
    });
};


exports.list = (req, res, next) => {
  App.list()
    .then((apps) => {
      res.render('apps/list.html', { apps });
    })
    .catch(next);
};


exports.details = (req, res, next) => {
  Promise.all([App.get(req.params.id), Bucket.list(), User.list()])
    .then(([app, buckets, users]) => {
      const current_user_is_app_admin = app.has_admin(req.user.auth0_id);
      res.render('apps/details.html', {
        app,
        buckets_options: buckets.exclude(app.buckets),
        users,
        users_options: users.exclude(app.users),
        current_user_is_app_admin,
      });
    })
    .catch(next);
};


exports.delete = (req, res, next) => {
  App.delete(req.params.id)
    .then(() => {
      let redirect_to = 'base.home';
      if (req.user.is_superuser) {
        redirect_to = 'apps.list';
      }
      res.redirect(url_for(redirect_to));
    })
    .catch(next);
};
