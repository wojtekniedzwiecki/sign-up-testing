import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { delay } from "../../helpers/helpers";

export class CompleteProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  public getFullNameInput(): Locator {
    return this.page.locator('input#fullName');
  }

  public getCompanyInput(): Locator {
    return this.page.locator('input#company');
  }

  public getEmployeesDropdown(): Locator {
    return this.page.locator('fieldset#numberOfEmployees');
  }

  public getDropdownList(): Locator {
    return this.page.locator('#popup [role="list"] [role="group"]');
  }

  public getCountryDropdown(): Locator {
    return this.page.locator('fieldset#country');
  }

  public getPhoneInput(): Locator {
    return this.page.locator('input#telephone');
  }

  public getErrorMessage(): Locator {
    return this.page.locator('.ErrorMessage-eQTUTc');
  }

  public getSaveProfileButton(): Locator {
    return this.page.locator('button[data-testid="save-profile"]');
  }

  public getSwitchAccountButton(): Locator {
    return this.page.locator('button[title="Switch account"]');
  }
}