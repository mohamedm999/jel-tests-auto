import { type Locator, type Page } from "@playwright/test";

export class OptinsPage {
  readonly page: Page;
  readonly form: Locator;
  readonly selfPromoting: Locator;
  readonly submitForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = this.page.getByTestId("optins-form");
    this.submitForm = this.form.getByTestId("proceed");
    this.selfPromoting = this.form.locator("#selfPromoting");
  }

  async checkSelfPromoting() {
    await this.selfPromoting.check({ trial: true });
  }
}
