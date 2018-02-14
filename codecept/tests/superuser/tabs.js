Feature('Check tabs');


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

Scenario('Data tab', (I) => {
  I.seeElement('li.tab-data');
  I.click('li.tab-data');
  I.waitUrlEquals('/#Data');
  I.dontSee('Your tools');
  I.see('Your data sources');
  I.say('I am on the Data tab');
});

Scenario('Webapps tab', (I) => {
  I.seeElement('li.tab-webapps');
  I.click('li.tab-webapps');
  I.waitUrlEquals('/#Webapps');
  I.dontSee('Your data sources');
  I.see('Your apps');
  I.say('I am on the Webapps tab');
});
