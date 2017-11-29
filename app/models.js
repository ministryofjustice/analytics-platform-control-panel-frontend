const { Model, ModelSet } = require('./base-model');


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
