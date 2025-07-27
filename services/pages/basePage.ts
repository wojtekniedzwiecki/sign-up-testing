import { Locator, Page } from '@playwright/test';
import { delay } from "../../helpers/helpers";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public getAllowCookieButton(): Locator {
        return this.page.locator('button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    }

    public getErrorMessage(): Locator {
        return this.page.locator('.ErrorMessage-eQTUTc');
    }

    public async handleCookieBanner(page: Page) {
        await delay(500);
        if (await this.getAllowCookieButton().isVisible()) {
            this.getAllowCookieButton().click();
        }
    }
}
