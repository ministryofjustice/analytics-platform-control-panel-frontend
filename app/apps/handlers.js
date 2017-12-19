const { App, Bucket, User } = require('../models');
const { Repo } = require('../models/github');
const config = require('../config');
const github = require('../api_clients/github');


exports.new = (req, res, next) => {
  github.api.authenticate(req.user)
    .then(() => {
      return Promise.all([Repo.list(), Bucket.list()]);
    })
    .then(([repos, buckets]) => {
      res.render('apps/new.html', {
        repo_prefix: config.github.web_host,
        orgs: config.github.orgs,
        repos,
        bucket_prefix: `${process.env.ENV}-`,
        buckets,
      });
    })
    .catch(next);
};

exports.create = (req, res, next) => {
  const app = new App({
    name: req.body.name,
    description: req.body.description,
    repo_url: req.body.repo_url,
    userapps: [],
  });
  const create_bucket = new Promise((resolve, reject) => {
    if (req.body['new-app-datasource'] === 'create') {
      resolve(new Bucket({
        name: req.body['new-datasource-name']
      }).create());
    } else {
      resolve(null);
    }
  });

  Promise.all([app.create(), create_bucket])
    .then(([created_app, created_bucket]) => {
      let grant_access = Promise.resolve(null);

      if (created_bucket) {
        grant_access = created_app.grant_bucket_access(created_bucket.id, 'readonly');
      } else if (req.body['new-app-datasource'] === 'select') {
        grant_access = created_app.grant_bucket_access(req.body['select-existing-datasource'], 'readonly');
      }
      grant_access
        .then(() => {
          created_app.grant_user_access(req.user.auth0_id, 'readwrite', true)
        })
        .then(() => {
          const { url_for } = require('../routes'); // eslint-disable-line global-require
          res.redirect(url_for('apps.details', { id: created_app.id }));
        });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.render('apps/new.html', {
          app,
          errors: err.error,
        });
      } else {
        next(err);
      }
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
      const { url_for } = require('../routes'); // eslint-disable-line global-require
      let redirect_to = 'base.home';
      if (req.user.is_superuser) {
        redirect_to = 'apps.list';
      }
      res.redirect(url_for(redirect_to));
    })
    .catch(next);
};
