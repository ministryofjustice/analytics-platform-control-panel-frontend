Feature('Log in, check non-superuser homepage @nonsuperuser');


Scenario('Check non-superuser homepage', (I) => {
  I.waitUrlEquals('/#Analytical tools');
  I.say('Have been returned to homepage');
  I.dontSee('Superuser');
  I.see('Your tools');
  I.dontSeeElement('li.tab-superuser');
  I.seeElement('li.tab-analytical-tools');
  I.seeElement('li.tab-warehouse-data');
  I.dontSeeElement('li.tab-webapp-data');
  I.dontSeeElement('li.tab-webapps');
  I.see('RStudio');
  I.say('I am logged in as a non-super-user');
});
