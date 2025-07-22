import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

//   public getTableRow(): Locator {
//     return this.page.locator('tr[role="row"].cdk-row');
//   }

//   public async findNumberOfRowByText(text: string): Promise<number> {
//     const rows = await this.page.locator('tr[role="row"].cdk-row'); // Select all rows
//     let rowIndex = -1;

//     for (let i = 0; i < await rows.count(); i++) {
//       const row = rows.nth(i);
//       if ((await row.innerText()).includes(text)) {
//         rowIndex = i;
//         break;
//       }
//     }
//     return rowIndex;
//   }

//   public findAllRowsByText(name: string): Locator {
//     return this.getTableRow().filter({ hasText: name });
//   }

//   public async selectFromDropdown(page: Page, value: string): Promise<void> {
//     await page.click(`mat-option >> text="${value}"`);
//   }

//   public getDialog(): Locator {
//     return this.page.locator('mat-dialog-container.mdc-dialog--open');
//   }

//   public getSaveButton(): Locator {
//     return this.page.locator('button').getByText('Save');
//   }
}
