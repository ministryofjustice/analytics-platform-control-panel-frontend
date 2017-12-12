const { Model, ModelSet } = require('./base-model');
const { K8sModel } = require('./k8s-model');


class App extends Model {
  static get endpoint() {
    return 'apps';
  }

  get apps3buckets() {
    return new ModelSet(AppS3Bucket, this.data.apps3buckets);
  }

  get buckets() {
    return new ModelSet(Bucket, this.data.apps3buckets.map(as => as.s3bucket));
  }

  get users() {
    return new ModelSet(User, this.data.userapps.map(ua => ua.user));
  }

  grant_bucket_access(bucket, access_level = 'readonly') {
    if (!['readonly', 'readwrite'].includes(access_level)) {
      throw new Error(`Invalid access_level "${access_level}"`);
    }

    let bucket_id = bucket;

    if (typeof bucket === 'function' && bucket.prototype.constructor === Bucket) {
      bucket_id = bucket.id;
    }

    return new AppS3Bucket({
      app: this.id,
      s3bucket: bucket_id,
      access_level,
    }).create();
  }

  grant_user_access(user_id, access_level = 'readonly', is_admin = false) {
    if (!['readonly', 'readwrite'].includes(access_level)) {
      throw new Error(`Invalid access_level "${access_level}"`);
    }

    return new UserApp({
      app: this.id,
      user: user_id,
      access_level,
      is_admin,
    }).create();
  }

  has_admin(user_id) {
    return true; // TODO: remove this and return real value once perms have been implemented
    // return this.data.userapps.some(ua => ua.is_admin && ua.user.auth0_id === user_id);
  }
}

exports.App = App;


class AppS3Bucket extends Model {
  static get endpoint() {
    return 'apps3buckets';
  }
}

exports.AppS3Bucket = AppS3Bucket;


class Bucket extends Model {
  static get endpoint() {
    return 's3buckets';
  }

  get apps() {
    return new ModelSet(App, this.data.apps3buckets.map(as => as.app));
  }

  get apps3buckets() {
    return new ModelSet(AppS3Bucket, this.data.apps3buckets);
  }

  get users() {
    return new ModelSet(User, this.data.users3buckets.map(us => us.user));
  }

  get users3buckets() {
    return new ModelSet(UserS3Bucket, this.data.users3buckets);
  }

  has_admin(user_id) {
    return true; // TODO: remove this and return real value once perms have been implemented
  }
}

exports.Bucket = Bucket;


class User extends Model {
  static get endpoint() {
    return 'users';
  }

  static get pk() {
    return 'auth0_id';
  }

  get apps() {
    return new ModelSet(App, this.data.userapps.map(ua => ua.app));
  }

  get buckets() {
    return new ModelSet(Bucket, this.data.users3buckets.map(us => us.s3bucket));
  }

  get users3buckets() {
    return new ModelSet(UserS3Bucket, this.data.users3buckets);
  }
}

exports.User = User;


class UserS3Bucket extends Model {
  static get endpoint() {
    return 'users3buckets';
  }
}

exports.UserS3Bucket = UserS3Bucket;


class UserApp extends Model {
  static get endpoint() {
    return 'userapps';
  }
}

exports.UserApp = UserApp;


class Deployment extends K8sModel {
  static get endpoint() {
    return 'deployments';
  }

  static restart(label) {
    return Pod.delete_all({ labelSelector: `app=${label}` });
  }

  get_pods() {
    return Pod.list({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  restart() {
    return Pod.delete_all({ labelSelector: `app=${this.data.metadata.labels.app}` });
  }

  get_status() {
    for (let condition of this.status.conditions) {
      if (condition.type === 'Available') {
        if (condition.status === 'True') {
          return 'Available';
        } else {
          return 'Unavailable';
        }
      }
    }
    return 'Unknown';
  }
}

exports.Deployment = Deployment;


class Pod extends K8sModel {
  static get endpoint() {
    return 'pods';
  }

  get display_status() {
    // based on
    // https://github.com/kubernetes/dashboard/blob/91c54261c6a3d7f601c67a2ccfbbe79f3b6a89f9/src/app/frontend/pod/list/card_component.js#L98

    let containerStatus = this.data.status.containerStatuses;

    if (containerStatus) {
      let state = containerStatus[0].state;

      if (state.waiting) {
        return `Waiting: ${state.waiting.reason}`;
      }

      if (state.terminated) {
        let reason = state.terminated.reason;

        if (!reason) {
          if (state.terminated.signal) {
            reason = `Signal:${state.terminated.signal}`;
          } else {
            reason = `ExitCode:${state.terminated.exitCode}`;
          }
        }

        return `Terminated: ${reason}`;
      }
    }

    return this.data.status.phase;
  }
}

exports.Pod = Pod;
