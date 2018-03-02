Feature('Log in, check non-superuser homepage');


Scenario('Check non-superuser homepage', (I) => {
  I.waitUrlEquals('/#Analytical tools');
  I.say('Have been returned to homepage');
  I.dontSee('Superuser');
  I.see('Your tools');
  I.see('RStudio');
  I.say('I am logged in as a non-super-user');
});
