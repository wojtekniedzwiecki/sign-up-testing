import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";


export class CreateAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public getEmailAddressInput(): Locator {
    return this.page.locator('input#email');
  }

  public getPasswordInput(): Locator {
    return this.page.locator('input#password');
  }

  public getMarketingCheckbox(): Locator {
    return this.page.locator('input[name="marketing"]');
  }

  public getCreateAccountButton(): Locator {
    return this.page.locator('button[data-testid="create-account"]');
  }

  public getContinueWithGoogleButton(): Locator {
    return this.page.locator('[data-testid="google-signup"]');
  }

  public getLogInLink(): Locator {
    return this.page.locator('[data-testid="login"]');
  }

  public getTermsAndConditionsLink(): Locator {
    return this.page.locator('[href="https://ninox.com/terms"]');
  }

  public getPrivacyPolicyLink(): Locator {
    return this.page.locator('[href="https://ninox.com/privacy"]');
  }

  public getFormErrorMessage(): Locator {
    return this.page.locator('.FormErrorMessage-fdCIbC');
  }

  public async createNewUser(page: Page, emailAddress: string, password: string) {
    await expect(this.getCreateAccountButton()).toBeVisible();
    await this.getEmailAddressInput().fill(emailAddress);
    await this.getPasswordInput().fill(password);
    await this.getCreateAccountButton().click();
  }
}