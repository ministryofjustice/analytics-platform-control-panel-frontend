module.exports = {
  auth0_id: 'github|1',
  url: 'http://localhost:8000/users/github%7C1/',
  username: 'johndoe',
  name: 'John Doe',
  email: '',
  groups: [],
  userapps: [
    {
      id: 1,
      app: {
        id: 1,
        url: 'http://localhost:8000/apps/1/',
        name: 'test-app',
        slug: 'test-app',
        repo_url: 'https://www.example.com/test-app',
        iam_role_name: 'dev_app_test-app',
        created_by: 'github|1',
      },
      is_admin: true,
    },
  ],
  users3buckets: [
    {
      id: 1,
      s3bucket: {
        id: 1,
        url: 'http://localhost:8000/s3buckets/1/',
        name: 'test-bucket-1',
        arn: 'arn:aws:s3:::test-bucket-1',
        created_by: null,
      },
      access_level: 'readwrite',
      is_admin: true,
    },
  ],
  is_superuser: false,
};
