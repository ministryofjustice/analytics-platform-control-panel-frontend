'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({
    login: function(user, token) {
      this.amOnPage('/');
      this.see('Analytical Platform');
      this.seeInCurrentUrl('analytics-moj.eu.auth0.com/login');
      this.say('Redirect to Auth0 successful');

      // waiting for the element doesn't work, waiting for the text does.
      this.waitForText('LOG IN WITH GITHUB', 10);
      this.see('LOG IN WITH GITHUB');
      // clicking the text doesn't work, clicking the element does.
      this.click('button[data-provider="github"]');
      this.waitForText('Sign in to GitHub', 10);
      this.say('Reached login page on GitHub');

      this.fillField('#login_field', user.username);
      this.fillField('#password', user.password);
      this.click('Sign in');

      this.waitForText('Two-factor authentication', 10);
      this.say('Login details correct, reached 2FA page');

      this.fillField('#otp', token);
      this.click('Verify');
      this.waitForText('Analytical Platform Control Panel', 10);
      this.say('2FA successful, returned to platform');

      // this.see('Verify Your Email Address');
      // this.seeElement('input#email');
      // this.seeInField('email', test_user.email);
      // this.click('Verify');
      this.dontSee('Verify Your Email Address'); // not testing that at this time
      this.say('Email address already verified');
    }
  });
}
