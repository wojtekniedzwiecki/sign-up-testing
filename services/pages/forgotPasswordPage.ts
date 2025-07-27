import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";


export class ForgotPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public getEmailAddressInput(): Locator {
    return this.page.locator('input#email');
  }

  public getResetPasswordButton(): Locator {
    return this.page.locator('button[data-testid="reset-password"]');
  }
}