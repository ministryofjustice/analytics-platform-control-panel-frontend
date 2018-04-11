Feature('Check tabs @superuser');


Scenario('Superuser tab', (I) => {
  I.amOnPage('/');
  I.waitUrlEquals('/#Superuser');
  I.see('Superuser functions');
  I.say('I am on the Superuser tab');
});

Scenario('Tools tab', (I) => {
  I.seeElement('li.tab-analytical-tools');
  I.click('li.tab-analytical-tools');
  I.waitUrlEquals('/#Analytical tools');
  I.dontSee('Superuser functions');
  I.see('Your tools');
  I.say('I am on the Tools tab');
});

Scenario('Warehouse data tab', (I) => {
  I.seeElement('li.tab-warehouse-data');
  I.click('li.tab-warehouse-data');
  I.waitUrlEquals('/#Warehouse data');
  I.dontSee('Your tools');
  I.see('Your warehouse data sources');
  I.say('I am on the Warehouse data tab');
});

Scenario('Webapp data tab', (I) => {
  I.seeElement('li.tab-webapp-data');
  I.click('li.tab-webapp-data');
  I.waitUrlEquals('/#Webapp data');
  I.dontSee('Your tools');
  I.see('Your webapp data sources');
  I.say('I am on the Webapp data tab');
});

Scenario('Webapps tab', (I) => {
  I.seeElement('li.tab-webapps');
  I.click('li.tab-webapps');
  I.waitUrlEquals('/#Webapps');
  I.dontSee('Your data sources');
  I.see('Your apps');
  I.say('I am on the Webapps tab');
});
