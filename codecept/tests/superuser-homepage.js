Feature('Superuser homepage @superuser');


Scenario('Check superuser homepage', (I) => {
  I.amOnPage('/');
  I.waitUrlEquals('/#Superuser');
  I.say('Have been returned to homepage');
  I.see('Superuser functions');
  I.dontSee('Your tools');
  I.say('I am logged in as a super-user');
});
