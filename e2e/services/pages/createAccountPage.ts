import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { delay } from "../../helpers/helpers";

export class CreateAccountPage extends BasePage{
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

    public getAllowCookieButton(): Locator {
      return this.page.locator('button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    }

    public getErrorMessage(): Locator {
      return this.page.locator('.ErrorMessage-eQTUTc');
    }

    public getFormErrorMessage(): Locator {
      return this.page.locator('.FormErrorMessage-fdCIbC');
    }
    
    public async handleCookieBanner(page: Page) {
      await delay(200);  
      if(await this.getAllowCookieButton().isVisible()) {
          this.getAllowCookieButton().click();
        }
      }
  }