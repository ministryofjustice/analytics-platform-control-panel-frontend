require('dotenv').config();
const { generateToken } = require('authenticator');
const test_user = {
  username: process.env.TEST_USER_USERNAME,
  email: process.env.TEST_USER_EMAIL,
  key: process.env.TEST_USER_KEY,
  password: process.env.TEST_USER_PASSWORD
};
const formatted_token = generateToken(test_user.key);


Feature('Log in @current');

Scenario('Log in', (I) => {
  I.login(test_user, formatted_token);
});
