import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";


export class MyTeamsPage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public getWelcomeDialog(): Locator {
    return this.page.locator('[data-usln="accessibile-container"] [role="dialog"]');
  }

}