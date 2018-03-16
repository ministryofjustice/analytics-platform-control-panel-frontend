require('dotenv').config();
const { generateToken } = require('authenticator');
const test_user = {
  username: process.env.TEST_USER_USERNAME,
  email: process.env.TEST_USER_EMAIL,
  github_key: process.env.TEST_USER_GITHUB_KEY,
  auth0_key: process.env.TEST_USER_AUTH0_KEY,
  password: process.env.TEST_USER_PASSWORD
};
const formatted_github_token = generateToken(test_user.github_key);
const formatted_auth0_token = generateToken(test_user.auth0_key);


Feature('Log in @nonsuperuser @superuser');

Scenario('Log in', (I) => {
  I.login(test_user, formatted_github_token, formatted_auth0_token);
});
