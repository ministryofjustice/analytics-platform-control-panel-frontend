require('dotenv').config();
const test_user_username = process.env.TEST_USER_USERNAME;
const test_user_name = process.env.TEST_USER_NAME;
const rand_suffix1 = Math.round(Math.random() * 1000000).toString();
const rand_suffix2 = Math.round(Math.random() * 1000000).toString();
const test_app_name = `TEST-E2E-APP-WITH-BUCKET-${rand_suffix1}`;
const test_bucket_suffix = `test-e2e-bucket-${rand_suffix2}`;
let bucket_prefix;
let test_bucket_name;


Feature('Create and delete app and data source @superuser');


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

Scenario('Name new data source', (I) => {
  I.dontSee('input#new-datasource-name');
  I.see('Create a new webapp data source');
  I.click('Create a new webapp data source');
  I.waitForElement('input#new-datasource-name');
  I.say('Enter data source name box is visible');
});

Scenario('Grab data source prefix', function* (I) {
  bucket_prefix = yield I.grabValueFrom('input#new-datasource-name');
  I.say('Data source prefix grabbed: ' + bucket_prefix);
  test_bucket_name = bucket_prefix + test_bucket_suffix;
  I.say(`Data source name will be: ${test_bucket_name}`);
});

Scenario('Enter data source name', (I) => {
  I.fillField('input#new-datasource-name', test_bucket_suffix);
  I.seeInField('input#new-datasource-name', test_bucket_name);
  I.say(`Data source name entered: ${test_bucket_name}`);
});

Scenario('Create app and data source', (I) => {
  I.click('Create');
});

Scenario('Check app page', (I) => {
  I.waitInUrl('/apps/');
  I.see(`App: ${test_app_name}`, 'h1');
  I.say('App created');
  I.see(test_user_name, 'table.app-admins');
  I.say('Test user is admin for app');
  I.see('1 app data source connected to this app');
  I.see(test_bucket_name, 'table.app-data-sources');
  I.say('App has newly created data source attached');
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

Scenario('Delete data source', (I) => {
  I.click('Home', '.breadcrumbs');
  I.waitUrlEquals('/#Superuser');
  I.click('List all data sources');
  I.waitUrlEquals('/buckets');
  I.click(test_bucket_name);
  I.waitForText(test_bucket_name, 'h1');
  I.click('Delete data source');
  I.acceptPopup();
});

Scenario('Check data source was deleted', (I) => {
  I.waitUrlEquals('/#Superuser');
  I.see(`Bucket "${test_bucket_name}" deleted`, '.flash-message');
  I.say('Data source was deleted');
});
