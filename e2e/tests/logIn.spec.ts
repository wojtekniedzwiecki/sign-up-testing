import { expect, test } from '@playwright/test';
import { CreateAccountPage } from '../services/pages/createAccountPage';
import dotenv from 'dotenv';
import testData from '../test-data/credentials.json'
import { CompleteProfilePage } from '../services/pages/completeProfilePage';
import { MyTeamsPage } from '../services/pages/myTeamsPage';
import MailSlurp from "mailslurp-client";
import { SignInPage } from '../services/pages/signInPage';
import { generateRandomEmail, generateStrongPassword } from "../helpers/helpers";
import { ForgotPasswordPage } from '../services/pages/forgotPasswordPage';

dotenv.config();

test.describe('Log in tests', () => {
  let signInPage: SignInPage;
  const invalidCredentials = testData.invalidCredentials;

  test.beforeEach(async ({ page }) => {

    await page.goto('/sign-in');
    signInPage = new SignInPage(page);
    await signInPage.handleCookieBanner(page);
  });

  test('Should display error email or password is incorrect', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getEmailAddressInput()).toBeVisible();
    await signInPage.getEmailAddressInput().fill(invalidCredentials.emailAddress);
    await signInPage.getPasswordInput().fill(invalidCredentials.password);
    await signInPage.getLogInButton().click();
    await expect(await signInPage.getErrorMessage()).toContainText('Email or password - something is not right.');
  });

  test('Should be redirected to My Teams page afer succesfull log in', async ({
    page,
  }) => {
    let createAccountPage = new CreateAccountPage(page);
    let myTeamsPage = new MyTeamsPage(page);
    let completeProfilePage = new CompleteProfilePage(page);

    const uniqueValidEmail = generateRandomEmail();
    const uniqueStrongPassword = generateStrongPassword();

    await page.goto('/create-account');
    await createAccountPage.createNewUser(page, uniqueValidEmail, uniqueStrongPassword);
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
    await page.context().clearCookies();

    await page.goto('/sign-in');
    await signInPage.handleCookieBanner(page);
    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getEmailAddressInput()).toBeVisible();
    await signInPage.getEmailAddressInput().fill(uniqueValidEmail);
    await signInPage.getPasswordInput().fill(uniqueStrongPassword);
    await signInPage.getLogInButton().click();

    await signInPage.handleCookieBanner(page);

    await expect(myTeamsPage.getWelcomeDialog()).toBeVisible();
    await expect(myTeamsPage.getWelcomeDialog()).toContainText('Welcome!');
    await expect(page.url()).toContain('#/teams/');

  });

  test('Should provide integration to sign in with google account', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getContinueWithGoogleButton()).toBeVisible();

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      await signInPage.getContinueWithGoogleButton().click(),
    ]);

    await popup.waitForLoadState();
    expect(popup.url()).toContain('accounts.google.com');
    await expect(popup).toHaveTitle(/Sign in/);

    //I don't test here login via google itself, quite often there is captcha, google finds testing frameworks as bots and blocks them, it can cause instability in tests and CI/CD
  });

  test('Should redirect to account creator when clicking on Get started now link', async ({
    page,
  }) => {
    let createAccountPage = new CreateAccountPage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getStartedNowLink()).toBeVisible();
    await signInPage.getStartedNowLink().click();
    if (await signInPage.getForWorkLink().isVisible()) {
      await expect(signInPage.getForWorkLink()).toBeVisible();
      await signInPage.getForWorkLink().click();
      await signInPage.getNextButton().click();
    }
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await expect(page.url()).toContain('/create-account');
  });


  test.skip('Should send email to reset the password for registered email', async ({
    page,
  }) => {

    let forgotPasswordPage = new ForgotPasswordPage(page);
    let createAccountPage = new CreateAccountPage(page);
    let completeProfilePage = new CompleteProfilePage(page);

    const apiKey = process.env.API_KEY;
    expect(apiKey).toBeDefined();

    const mailslurp = new MailSlurp({ apiKey })
    const { id, emailAddress } = await mailslurp.createInbox();
    const uniqueStrongPassword = generateStrongPassword();

    await page.goto('/create-account');
    await createAccountPage.createNewUser(page, emailAddress, uniqueStrongPassword);
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
    await page.context().clearCookies();

    await page.goto('/sign-in');
    await signInPage.handleCookieBanner(page);
    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getResetPasswordLink()).toBeVisible();
    await signInPage.getResetPasswordLink().click();
    await forgotPasswordPage.getEmailAddressInput().fill(emailAddress);
    await forgotPasswordPage.getResetPasswordButton().click();

    const email = await mailslurp.waitForNthEmail(id, 1);
    expect(email.sender?.emailAddress).toEqual('support@ninox.com');
    expect(email.body).toContain('Forgot your password?');
    expect(email.body).toContain('A password reset has been requested for your email');
  });
  
  test.skip('Should not send email to reset the password for non-registered email', async ({
    page,
  }) => {

    let forgotPasswordPage = new ForgotPasswordPage(page);

    const apiKey = process.env.API_KEY;
    expect(apiKey).toBeDefined();

    const mailslurp = new MailSlurp({ apiKey })
    const { id, emailAddress } = await mailslurp.createInbox();
    
    await page.goto('/sign-in');
    await signInPage.handleCookieBanner(page);
    await expect(page).toHaveTitle('Ninox');
    await expect(signInPage.getResetPasswordLink()).toBeVisible();
    await signInPage.getResetPasswordLink().click();
    await forgotPasswordPage.getEmailAddressInput().fill(emailAddress);
    await forgotPasswordPage.getResetPasswordButton().click();

    try {
      await mailslurp.waitForLatestEmail(id, 10000); // 10 seconds
      // If email is received, this is a test failure
      throw new Error('An email was sent unexpectedly.');
    } catch (error) {
      // MailSlurp throws an error if email was NOT received
      expect(error.message).toContain('Failed to satisfy email query for inbox ID');
      expect(error.message).toContain(id);
    }
  });


});
