module.exports = {
  id: 1,
  url: 'http://localhost:8000/s3buckets/1/',
  name: 'test-bucket-1',
  arn: 'arn:aws:s3:::test-bucket-1',
  apps3buckets: [
    {
      id: 1,
      url: 'http://localhost:8000/apps3buckets/1/',
      app: {
        id: 1,
        url: 'http://localhost:8000/apps/1/',
        name: 'test-app',
        slug: 'test-app',
        repo_url: 'https://www.example.com/test-app',
        iam_role_name: 'test_app-test-app',
        created_by: 'github|1',
      },
      access_level: 'readonly',
    },
  ],
  users3buckets: [
    {
      id: 1,
      user: {
        auth0_id: 'github|1',
        url: 'http://localhost:8000/users/github%7C1/',
        username: 'johndoe',
        name: '',
        email: '',
      },
      access_level: 'readonly',
      is_admin: false,
    },
  ],
  created_by: null,
};
