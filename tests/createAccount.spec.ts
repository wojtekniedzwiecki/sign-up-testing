import { expect, test } from '@playwright/test';
import { CreateAccountPage } from '../services/pages/createAccountPage';
import dotenv from 'dotenv';
import testData from '../test-data/credentials.json'
import { generateRandomEmail, generateStrongPassword } from '../helpers/helpers';
import { CompleteProfilePage } from '../services/pages/completeProfilePage';
import { MyTeamsPage } from '../services/pages/myTeamsPage';
import MailSlurp from "mailslurp-client";
import { SignInPage } from '../services/pages/signInPage';

dotenv.config();

test.describe('Create account tests', () => {
  let createAccountPage: CreateAccountPage;

  const invalidCredentials = testData.invalidCredentials;

  test.beforeEach(async ({ page }) => {
    createAccountPage = new CreateAccountPage(page);
    await page.goto('/create-account');
    await createAccountPage.handleCookieBanner(page);
  });

  test('Should display error if only email is incorrect', async ({
    page,
  }) => {
    const uniqueStrongPassword = generateStrongPassword();

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(invalidCredentials.emailAddress);
    await createAccountPage.getPasswordInput().fill(uniqueStrongPassword);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getEmailAddressInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getPasswordInput()).toHaveAttribute('aria-invalid', 'false');
    await expect(createAccountPage.getErrorMessage()).toContainText('Invalid email address');
  });


  test('Should display error if only password is incorrect', async ({
    page,
  }) => {
    const uniqueValidEmail = generateRandomEmail();

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(uniqueValidEmail);
    await createAccountPage.getPasswordInput().fill(invalidCredentials.password);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getEmailAddressInput()).toHaveAttribute('aria-invalid', 'false');
    await expect(createAccountPage.getPasswordInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getErrorMessage()).toContainText('Incorrect password. Please try again.');
  });


  test('Should display error if email and password are incorrect', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(invalidCredentials.emailAddress);
    await createAccountPage.getPasswordInput().fill(invalidCredentials.password);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getEmailAddressInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getPasswordInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getErrorMessage().nth(0)).toContainText('Invalid email address');
    await expect(createAccountPage.getErrorMessage().nth(1)).toContainText('Incorrect password. Please try again.');
  });


  test('Should be able to create account if marketing checkbox is not checked', async ({
    page,
  }) => {
    const uniqueValidEmail = generateRandomEmail();
    const uniqueStrongPassword = generateStrongPassword();
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(uniqueValidEmail);
    await createAccountPage.getPasswordInput().fill(uniqueStrongPassword);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
  });


  test('Should get error message if user want to use email of already existing account  - @smoke', async ({
    page,
  }) => {
    const uniqueValidEmail = generateRandomEmail();
    const uniqueStrongPassword = generateStrongPassword();
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(uniqueValidEmail);
    await createAccountPage.getPasswordInput().fill(uniqueStrongPassword);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
    await page.context().clearCookies();
    await page.goto('/create-account');
    await createAccountPage.handleCookieBanner(page);
    await createAccountPage.getEmailAddressInput().fill(uniqueValidEmail);
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getFormErrorMessage()).toContainText('User with this email already exists');
  });


  test.skip('Should send email asking for confirmation after creating new account - @smoke', async ({
    page,
  }) => {
    const apiKey = process.env.API_KEY;
    expect(apiKey).toBeDefined();

    const mailslurp = new MailSlurp({ apiKey })
    const { id, emailAddress } = await mailslurp.createInbox();
    const uniqueStrongPassword = generateStrongPassword();
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(emailAddress);
    await createAccountPage.getPasswordInput().fill(uniqueStrongPassword);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();

    const email = await mailslurp.waitForLatestEmail(id);

    expect(email.sender?.emailAddress).toEqual('support@ninox.com');
    expect(email.body).toContain('Please confirm your email address');
    expect(email.body).toContain('all Ninox features will be available to you in the Public Cloud for');
  });


  test('Should provide integration to sign up with google account', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getContinueWithGoogleButton()).toBeVisible();
    await createAccountPage.getContinueWithGoogleButton().click();

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      await createAccountPage.getContinueWithGoogleButton().click(),
    ]);

    await popup.waitForLoadState();
    expect(popup.url()).toContain('accounts.google.com');
    await expect(popup).toHaveTitle(/Sign in/);

    //I don't test here login via google itself, quite often there is captcha, google finds testing frameworks as bots and blocks them, it can cause instability in tests and CI/CD
  });


  test('Should get redirected to Sign In page when clicking Log In link for not logged in user', async ({
    page,
  }) => {
    let signInPage = new SignInPage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getLogInLink()).toBeVisible();
    await createAccountPage.getLogInLink().click();
    await expect(signInPage.getLogInButton()).toBeVisible();
    await expect(signInPage.getStartedNowLink()).toBeVisible();
  });


  test('Should get redirected to My Teams page when clicking Log In link for already logged in user - @smoke', async ({
    page,
  }) => {

    const uniqueValidEmail = generateRandomEmail();
    const uniqueStrongPassword = generateStrongPassword();

    let completeProfilePage = new CompleteProfilePage(page);
    let myTeamsPage = new MyTeamsPage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(uniqueValidEmail);
    await createAccountPage.getPasswordInput().fill(uniqueStrongPassword);
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();

    await page.goto('/create-account');
    await createAccountPage.getLogInLink().click();
    await completeProfilePage.handleCookieBanner(page);

    await expect(myTeamsPage.getWelcomeDialog()).toBeVisible();
    await expect(myTeamsPage.getWelcomeDialog()).toContainText('Welcome!');
    await expect(page.url()).toContain('#/teams/');
  });


  test('Should be able open external links', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getTermsAndConditionsLink()).toBeVisible();
    const [termsAndConditionsTab] = await Promise.all([
      page.waitForEvent('popup'),
      await createAccountPage.getTermsAndConditionsLink().click(),
    ]);
    await termsAndConditionsTab.waitForLoadState();
    expect(termsAndConditionsTab.url()).toContain('/terms');
    await expect(termsAndConditionsTab).toHaveTitle(/Ninox Database - Ninox Software - Terms and Conditions/);

    await expect(createAccountPage.getPrivacyPolicyLink()).toBeVisible();
    const [privacyPolicyTab] = await Promise.all([
      page.waitForEvent('popup'),
      await createAccountPage.getPrivacyPolicyLink().click(),
    ]);
    await privacyPolicyTab.waitForLoadState();
    expect(privacyPolicyTab.url()).toContain('/privacy');
    await expect(privacyPolicyTab).toHaveTitle(/Privacy | Ninox/);
  });
});
