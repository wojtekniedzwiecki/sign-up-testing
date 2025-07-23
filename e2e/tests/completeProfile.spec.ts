import { expect, test } from '@playwright/test';
import { CreateAccountPage } from '../services/pages/createAccountPage';
import dotenv from 'dotenv';
import credentialsData from '../test-data/credentials.json'
import profileData from '../test-data/profileDetails.json'
import { generateRandomEmail, generateStrongPassword, generateTimestamp } from '../helpers/helpers';
import { CompleteProfilePage } from '../services/pages/completeProfilePage';
import { SignInPage } from '../services/pages/signInPage';
import { delay } from "../helpers/helpers";
import { MyTeamsPage } from '../services/pages/myTeamsPage';
dotenv.config();

test.describe('Complete profile tests', () => {
  let createAccountPage: CreateAccountPage;
  let completeProfilePage: CompleteProfilePage;
  let myTeamsPage: MyTeamsPage;

  const validCredentials = credentialsData.validCredentials;

  test.beforeEach(async ({ page }) => {
    createAccountPage = new CreateAccountPage(page);
    completeProfilePage = new CompleteProfilePage(page);
    myTeamsPage = new MyTeamsPage(page);

    const uniqueValidEmail = generateRandomEmail();
    const uniqueStrongPassword = generateStrongPassword();
    
    await page.goto('/create-account');
    await createAccountPage.handleCookieBanner(page);
    await createAccountPage.createNewUser(page, uniqueValidEmail, uniqueStrongPassword);
  });

  test('Should display error messages when user provides no profile details', async ({
    page,
  }) => {

    await expect(page).toHaveTitle('Ninox');
    await expect(await completeProfilePage.getFullNameInput()).toBeVisible();
    await completeProfilePage.getSaveProfileButton().click();
    await expect(await completeProfilePage.getErrorMessage().count()).toEqual(5);

    for (let i = 0; i < (await completeProfilePage.getErrorMessage().count()); i++) {
      await expect(await completeProfilePage.getErrorMessage().nth(i)).toContainText('Please fill in this field');
    }
  });

  test('Should save profile details when user provides all profile details', async ({
    page,
  }) => {
    const profileDetails = profileData.profile1;


    await expect(page).toHaveTitle('Ninox');

    await expect(await completeProfilePage.getFullNameInput()).toBeVisible();
    await completeProfilePage.getFullNameInput().fill(profileDetails.fullName);
    await completeProfilePage.getCompanyInput().fill(profileDetails.company);
    await completeProfilePage.getEmployeesDropdown().click()
    await completeProfilePage.getDropdownList().getByText(profileDetails.employees).click();
    await completeProfilePage.getCountryDropdown().click();
    await completeProfilePage.getDropdownList().getByText(profileDetails.country).click();
    await completeProfilePage.getPhoneInput().fill(profileDetails.phone);

    await completeProfilePage.getSaveProfileButton().click();
    await delay(2000);
    await completeProfilePage.handleCookieBanner(page);

    await expect(myTeamsPage.getWelcomeDialog()).toBeVisible();
    await expect(myTeamsPage.getWelcomeDialog()).toContainText('Welcome!');
    await expect(page.url()).toContain('#/teams/');
  });


  test('Should be redirected to log in screen after click on Switch Account button', async ({
    page,
  }) => {
    let signInPage = new SignInPage(page);

    await expect(page).toHaveTitle('Ninox');
    await expect(await completeProfilePage.getSwitchAccountButton()).toBeVisible();
    await completeProfilePage.getSwitchAccountButton().click();

    await expect(signInPage.getLogInButton()).toBeVisible();
    await expect(signInPage.getStartedNowLink()).toBeVisible();
  });
});
