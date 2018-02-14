require('dotenv').config();
const { generateToken } = require('authenticator');
const test_user = {
  username: process.env.TEST_USER_USERNAME,
  email: process.env.TEST_USER_EMAIL,
  key: process.env.TEST_USER_KEY,
  password: process.env.TEST_USER_PASSWORD
};
const formatted_token = generateToken(test_user.key);


Feature('Log in, check non-superuser homepage');

Scenario('Log in', (I) => {
  I.login(test_user, formatted_token);

  // I.see('Verify Your Email Address');
  // I.seeElement('input#email');
  // I.seeInField('email', test_user.email);
  // I.click('Verify');
  I.dontSee('Verify Your Email Address'); // not testing that at this time
});

Scenario('Check homepage', (I) => {
  I.waitUrlEquals('/#Analytical tools');
  I.say('Have been returned to homepage');
  I.dontSee('Superuser');
  I.see('Your tools');
  I.see('RStudio');
  I.say('I am logged in as a non-super-user');
});
