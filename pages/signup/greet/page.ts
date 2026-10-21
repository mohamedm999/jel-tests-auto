import { type Locator, type Page } from "@playwright/test";

export class GreetPage {
  readonly page: Page;
  readonly greetContent: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.greetContent = this.page.getByTestId("greet-content");
    this.submitButton = this.greetContent.getByTestId("continue");
  }

  async next() {
    await this.submitButton.click();
  }
}
