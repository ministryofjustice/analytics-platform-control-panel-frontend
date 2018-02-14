require('dotenv').config();
const test_user_username = process.env.TEST_USER_USERNAME;


Feature('List all users page');


Scenario('Go to superuser homepage', (I) => {
  I.amOnPage('/');
  I.waitUrlEquals('/#Superuser');
  I.say('This is the homepage');
});

Scenario('Go to list all users page', (I) => {
  I.see('List all users');
  I.click('List all users');
  I.waitUrlEquals('/users');
  I.say('This is the list all users page');
});

Scenario('Check list all users page', (I) => {
  I.see('Home', 'div.breadcrumbs a');
  I.see('Users', 'h1');
  I.see('Name', 'table.list thead');
  I.say('The users table is displayed');
  I.see(test_user_username, 'table.list tbody');
  I.say('The test user is in the table');
});
