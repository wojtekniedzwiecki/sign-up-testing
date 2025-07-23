import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";


export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public getEmailAddressInput(): Locator {
    return this.page.locator('input#emailAddress');
  }

  public getPasswordInput(): Locator {
    return this.page.locator('input#password');
  }

  public getLogInButton(): Locator {
    return this.page.locator('button[data-testid="login"]');
  }

  public getContinueWithGoogleButton(): Locator {
    return this.page.locator('[data-testid="google-signin"]');
  }

  public getStartedNowLink(): Locator {
    return this.page.locator('[data-testid="signup"]');
  }

  public getResetPasswordLink(): Locator {
    return this.page.locator('[data-testid="reset-password"]');
  }

  public getForWorkLink(): Locator {
    return this.page.locator('[data-testid="option-business"]');
  }

  public getPersonalLink(): Locator {
    return this.page.locator('[data-testid="option-private"]');
  }

  public getNextButton(): Locator {
    return this.page.locator('[data-testid="go-next"]');
  }

  public async logIn(page: Page, emailAddress: string, password: string) {
    await expect(this.getLogInButton()).toBeVisible();
    await this.getEmailAddressInput().fill(emailAddress);
    await this.getPasswordInput().fill(password);
    await this.getLogInButton().click();
  }
}