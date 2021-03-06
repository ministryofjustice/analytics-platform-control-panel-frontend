require('dotenv').config();
const test_user_username = process.env.TEST_USER_USERNAME;
const test_user_name = process.env.TEST_USER_NAME;
const rand_suffix = Math.round(Math.random() * 1000000).toString();
const test_bucket_suffix = `test-e2e-webapp-bucket-${rand_suffix}`;
let bucket_prefix;
let test_bucket_name;

Feature('Create and delete webapp data source @superuser');


Scenario('Go to webapp data sources tab', (I) => {
  I.amOnPage('/');
  I.seeElement('li.tab-webapp-data');
  I.click('li.tab-webapp-data');
  I.waitUrlEquals('/#Webapp data');
  I.say('This is the Webapp data tab');
});

Scenario('Create a webapp data source page', (I) => {
  I.see('Create new webapp data source');
  I.click('Create new webapp data source');
  I.waitUrlEquals('/buckets/new?type=webapp');
  I.say('This is the create new webapp data source page');
});

Scenario('Grab data source prefix', function* (I) {
  I.seeElement('input#new-datasource-name');
  bucket_prefix = yield I.grabValueFrom('input#new-datasource-name');
  I.say('Data source prefix grabbed: ' + bucket_prefix);
  test_bucket_name = bucket_prefix + test_bucket_suffix;
  I.say(`Data source name: ${test_bucket_name}`);
});

Scenario('Enter bucket name', (I) => {
  I.fillField('input#new-datasource-name', test_bucket_suffix);
  I.seeInField('input#new-datasource-name', test_bucket_name);
  I.say(`Data source name entered: ${test_bucket_name}`);
});

Scenario('Submit button enabled', (I) => {
  I.seeElement('input[type="submit"]');
});

Scenario('Create data source', (I) => {
  I.click('Create');
});

Scenario('Check data source page', (I) => {
  I.waitForText('Webapp data source:', 5, 'h1');
  I.see(test_bucket_name, 'h1');
  I.say('Data source created');
  I.see(test_user_name, 'table.bucket-users');
  I.say('Test user is admin for data source');
});

Scenario('Delete data source', (I) => {
  I.click('Delete data source');
  I.acceptPopup();
});

Scenario('Check data source was deleted', (I) => {
  I.waitUrlEquals('/#Superuser');
  I.see(`Bucket "${test_bucket_name}" deleted`, '.flash-message');
  I.say('Data source was deleted');
});
