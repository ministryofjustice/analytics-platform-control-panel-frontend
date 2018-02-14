require('dotenv').config();
const test_user_username = process.env.TEST_USER_USERNAME;
const test_user_name = process.env.TEST_USER_NAME;
const rand_suffix = Math.round(Math.random() * 1000000).toString();
const test_app_name = `TEST-E2E-APP-${rand_suffix}`;


Feature('Create and delete app');


Scenario('Go to apps tab', (I) => {
  I.amOnPage('/');
  I.seeElement('li.tab-webapps');
  I.click('li.tab-webapps');
  I.waitUrlEquals('/#Webapps');
  I.say('This is the webapps tab');
});

Scenario('Create an app page', (I) => {
  I.see('Create new app');
  I.click('Create new app');
  I.waitUrlEquals('/apps/new');
  I.say('This is the create new app page');
});

Scenario('Submit button disabled', (I) => {
  I.seeElement('input[type="submit"][disabled]');
  I.say('Create app submit button is disabled');
});

Scenario('Enter app name', (I) => {
  I.seeElement('select#repo_org');
  I.selectOption('select#repo_org', 'ministryofjustice');
  I.say('Org selected');
  I.seeElement('input#repo_typeahead');
  I.fillField('input#repo_typeahead', test_app_name);
  I.say(`App name entered: ${test_app_name}`);
});

Scenario('Submit button enabled', (I) => {
  I.dontSeeElement('input[type="submit"][disabled]');
  I.say('Create app submit button is enabled');
});

Scenario('Skip data source', (I) => {
  I.see('Do this later');
  I.click('Do this later');
  I.say('Skipping data source');
});

Scenario('Create app', (I) => {
  I.click('Create');
});

Scenario('Check app page', (I) => {
  I.waitInUrl('/apps/');
  I.see(`App: ${test_app_name}`, 'h1');
  I.say('App created');
  I.see(test_user_name, 'table.app-admins');
  I.say('Test user is admin for app');
  I.see('0 app data sources connected to this app');
  I.say('No data sources are attached');
});

Scenario('Delete app', (I) => {
  I.click('Delete app');
  I.acceptPopup();
});

Scenario('Check app was deleted', (I) => {
  I.waitUrlEquals('/apps');
  I.dontSee(test_app_name);
  I.say('App was deleted');
});
