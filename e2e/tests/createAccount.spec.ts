import { expect, test } from '@playwright/test';
import { CreateAccountPage } from '../services/pages/createAccountPage';
import dotenv from 'dotenv';
import { generateTimestamp } from '../helpers/helpers';
import { CompleteProfilePage } from '../services/pages/completeProfilePage';
import MailSlurp from "mailslurp-client";


dotenv.config();



test.describe('Create account tests', () => {
  let createAccountPage: CreateAccountPage;

  test.beforeEach(async ({ page }) => {
    createAccountPage = new CreateAccountPage(page);
    await page.goto('/create-account');
    await createAccountPage.handleCookieBanner(page);
  });

  test('Should display error if only email is incorrect', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill('invalid');
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getEmailAddressInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getPasswordInput()).toHaveAttribute('aria-invalid', 'false');
    await expect(createAccountPage.getErrorMessage()).toContainText('Invalid email address');
  });


  test('Should display error if only password is incorrect', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill('ndzwck@proton.me');
    await createAccountPage.getEmailAddressInput().fill('ndzwck@proton.me');
    await createAccountPage.getPasswordInput().fill('invalid');
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
    await createAccountPage.getEmailAddressInput().fill('invalid');
    await createAccountPage.getPasswordInput().fill('invalid');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getEmailAddressInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getPasswordInput()).toHaveAttribute('aria-invalid', 'true');
    await expect(createAccountPage.getErrorMessage().nth(0)).toContainText('Invalid email address');
    await expect(createAccountPage.getErrorMessage().nth(1)).toContainText('Incorrect password. Please try again.');
  });


  test('Should be able to create account if marketing checkbox is not checked', async ({
    page,
  }) => {
    const validEmail = `ndzwck+${generateTimestamp()}@proton.me`;
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(validEmail);
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
  });

  
  test('Should get error message if user want to use email of already existing account', async ({
    page,
  }) => {
    const validEmail = `ndzwck+${generateTimestamp()}@proton.me`;
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(validEmail);
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();
    await page.context().clearCookies();
    await page.goto('/create-account');
    await createAccountPage.handleCookieBanner(page);
    await createAccountPage.getEmailAddressInput().fill(validEmail);
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getFormErrorMessage()).toContainText('User with this email already exists');
  });


  test.skip('Should send email asking for confirmation after creating new account', async ({
    page,
  }) => {
    const apiKey = process.env.API_KEY;
    expect(apiKey).toBeDefined();

    const mailslurp = new MailSlurp({ apiKey })
    const { id, emailAddress } = await mailslurp.createInbox();
    let completeProfilePage = new CompleteProfilePage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(createAccountPage.getCreateAccountButton()).toBeVisible();
    await createAccountPage.getEmailAddressInput().fill(emailAddress);
    await createAccountPage.getPasswordInput().fill('Val1dPa$word');
    await createAccountPage.getCreateAccountButton().click();
    await expect(createAccountPage.getCreateAccountButton()).not.toBeVisible();
    await expect(completeProfilePage.getFullNameInput()).toBeVisible();

    const email = await mailslurp.waitForLatestEmail(id);

    expect(email.sender?.emailAddress).toEqual('support@ninox.com');
    expect(email.body).toContain('Please confirm your email address');
    expect(email.body).toContain('all Ninox features will be available to you in the Public Cloud for');
  });


  test.only('Should be able to sign up with google account', async ({
    page,
  }) => {
    const validEmail = `ndzwck+${generateTimestamp()}@proton.me`;
    let completeProfilePage = new CompleteProfilePage(page);

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
//to be continued
  });

});
