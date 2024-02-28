import {expect} from 'detox';
import {describe, it} from '@jest/globals';

describe('Authentication flow', () => {
  it('should be able to log in', async () => {
    // check the initial state of the email screen
    await expect(element(by.text('Sign into TodayTix'))).toBeVisible();
    await expect(element(by.text("What's your email?"))).toBeVisible();
    const emailFormInput = element(by.label('Email')).atIndex(1);
    const continueButton = element(by.text('Continue'));
    await expect(emailFormInput).toBeVisible();
    await expect(continueButton).toBeVisible();

    // enter a valid email
    await emailFormInput.typeText('good@gmail.com');
    await continueButton.tap();

    // check the initial state of the link screen
    await expect(element(by.text('Almost there...'))).toBeVisible();
    await expect(
      element(by.text('Please enter the login link from the TodayTix email'))
    ).toBeVisible();
    const linkFormInput = element(by.label('Link')).atIndex(1);
    const loginButton = element(by.text('Login'));
    await expect(linkFormInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // enter a valid code and login
    await linkFormInput.typeText('https://todaytix.com?token=good-code');
    await loginButton.tap();
    await expect(element(by.text('Guys & Dolls'))).toBeVisible();
  });
});
